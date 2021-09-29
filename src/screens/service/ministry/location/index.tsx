import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import { HFormControlLabel, HFormGroup, LocationContainer } from './style';
import { IParam, IProps } from '@interfaces';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOCATIONS, SET_LOCATIONS } from './gql';
import Progress from '@components/progress';
import { Fragment, useEffect, useState } from 'react';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import router from 'next/router';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { ILocation } from './type';
import BottomComponent from '@components/bottom';
import { HButton } from '@components/button/styled';
import Header from '@components/header';
import { CircularProgress } from '@material-ui/core';
import { HH2 } from '@components/text';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '@material-ui/core/Checkbox';

const Location: React.FC<IProps> = props => {
    const { idx } = props.query as IParam;
    const [locations, setLocations] = useState<Array<ILocation>>([]);
    const [isDrop, setIsDrop] = useState(0);

    const onClickDrop = (idx: number) => {
        if (isDrop === idx) {
            setIsDrop(0);
        } else {
            setIsDrop(idx);
        }
    };

    const onClickLocation = (lo_idx: number, de_idx: number, state: boolean) => {
        if (de_idx < 1) {
            const changed = locations[lo_idx].details.map(prev => ({ ...prev, state: !state }));
            setLocations(
                locations.map((lo, index) => {
                    if (lo_idx === index) {
                        return {
                            ...lo,
                            details: changed
                        };
                    }
                    return lo;
                })
            );
        } else {
            const changed = locations[lo_idx].details.map((prev, index) => {
                if (index === de_idx) {
                    return {
                        ...prev,
                        state: !state
                    };
                }
                return prev;
            });
            setLocations(
                locations.map((lo, index) => {
                    if (lo_idx === index) {
                        return {
                            ...lo,
                            details: changed
                        };
                    }
                    return lo;
                })
            );
        }
    };

    const { loading, data, refetch } = useQuery(GET_LOCATIONS, {
        variables: {
            idx: Number(idx)
        }
    });

    const [func, result] = useMutation(SET_LOCATIONS);

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onClickNext = () => {
        const array: Array<{ idx: number }> = [];
        locations.forEach(lo => {
            lo.details.forEach(de => {
                if (de.state && de.idx !== -1) {
                    array.push({ idx: de.idx });
                }
            });
        });
        func({
            variables: {
                idx: Number(idx),
                locations: array
            }
        });
    };

    useEffect(() => {
        if (data) {
            const {
                getLocations: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setLocations(rest.data);
            } else if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, rest.token, { path: '/' });
                refetch();
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [data]);

    useEffect(() => {
        if (result.data) {
            const {
                setLocations: { status, location, token, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                if (location) {
                    router.push(`/service/${location}`);
                } else {
                    router.push('/');
                }
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [result.data]);

    useEffect(() => {
        refetch();
    }, []);

    if (loading) {
        return <Progress />;
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} />
            <LocationContainer>
                <HH2>활동지역</HH2>
                {locations.map((lo, index) => {
                    return (
                        <Fragment key={index}>
                            <div
                                style={{ width: '100%', height: '45px', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                onClick={() => onClickDrop(lo.idx)}
                            >
                                {lo.location}
                                {lo.idx === isDrop ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </div>
                            <HFormGroup style={{ display: `${lo.idx === isDrop ? 'flex' : 'none'}` }}>
                                {lo.details.map((de, index2) => {
                                    return (
                                        <HFormControlLabel
                                            key={index2}
                                            data-checked={de.state}
                                            control={<Checkbox checked={de.state} onClick={() => onClickLocation(index, index2, de.state)} />}
                                            label={de.location}
                                        />
                                    );
                                })}
                            </HFormGroup>
                        </Fragment>
                    );
                })}
                <BottomComponent>
                    <HButton width="30%" onClick={() => router.push(`/service/ministry/describe?idx=${idx}`)}>
                        이전
                    </HButton>
                    <HButton width="30%" onClick={onClickNext}>
                        {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '완료'}
                    </HButton>
                </BottomComponent>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </LocationContainer>
        </AbstractComponent>
    );
};

export default Location;
