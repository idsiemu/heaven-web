import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import { HFormControlLabel, HFormGroup, LocationContainer } from './style';
import Checkbox from '@material-ui/core/Checkbox';
import { IParam, IProps } from '@interfaces';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOCATIONS, SET_LOCATIONS } from './gql';
import Progress from '@components/progress';
import { useEffect, useState } from 'react';
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

const Location = (props: IProps) => {
    const { idx } = props.query as IParam;
    const [locations, setLocations] = useState<Array<ILocation>>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const changed = { ...locations[name], state: checked };
        const [...rest] = locations;
        rest.splice(Number(name), 1, changed);
        setLocations(rest);
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
        func({
            variables: {
                idx: Number(idx),
                locations: locations.filter(lo => lo.state).map(ro => ({ idx: ro.idx }))
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
            <Header />
            <LocationContainer>
                <HH2>활동지역</HH2>
                <HFormGroup>
                    {locations.map((lo, index) => {
                        return (
                            <HFormControlLabel
                                key={index}
                                data-checked={lo.state}
                                control={<Checkbox checked={lo.state} onChange={handleChange} name={index.toString()} id={lo.idx.toString()} />}
                                label={lo.location}
                            />
                        );
                    })}
                </HFormGroup>
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
