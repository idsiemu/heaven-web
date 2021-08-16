import AbstractComponent from '@components/abstract';
import { HInput } from '@components/input/styled';
import { CircularProgress, Fab } from '@material-ui/core';
import GlobalStyle from '@styles/globalStyles';
import { SiteContainer } from './style';
import AddIcon from '@material-ui/icons/Add';
import { common } from '@definitions/styled-components';
import { useState, useEffect } from 'react';
import { IProps, IParam } from '@interfaces';
import { ISite } from './type';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { GET_SITES, SET_SITES } from './gql';
import { useMutation, useQuery } from '@apollo/client';
import Progress from '@components/progress';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import router from 'next/router';
import BottomComponent from '@components/bottom';
import { HButton } from '@components/button/styled';
import Header from '@components/header';

const Site = (props: IProps) => {
    const { idx } = props.query as IParam;
    const [sites, setSites] = useState<Array<ISite>>([
        { site_name: '유튜브', url: '' },
        { site_name: '인스타그램', url: '' },
        { site_name: '그 외', url: '' }
    ]);

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const { loading, data, refetch } = useQuery(GET_SITES, {
        variables: {
            idx: Number(idx),
            sites: sites.filter(si => si.url !== '').map(si => ({ site_name: si.site_name, url: si.url }))
        }
    });

    const [func, result] = useMutation(SET_SITES);

    const onChangeSites = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, id, value } = event.target;
        const [...rest] = sites;
        rest[id.replace(/[^0-9]/g, '')][name] = value;
        setSites(rest);
    };

    const onClickNext = () => {
        func({
            variables: {
                idx: Number(idx),
                sites: sites.filter(si => si.url !== '')
            }
        });
    };

    const onClickAdd = () => {
        if (sites[sites.length - 1].url === '') {
            setSnack(prev => ({ ...prev, message: '입력하지 않은 주소가 있습니다.', open: true }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        } else {
            setSites(sites.concat({ site_name: '그 외', url: '' }));
        }
    };

    useEffect(() => {
        if (result.data) {
            const {
                setSites: { status, location, token, errors }
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
        if (data) {
            const {
                getSites: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                if (rest.data.length > 0) {
                    setSites(rest.data);
                }
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
        refetch();
    }, []);

    if (loading) {
        return <Progress />;
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            <SiteContainer>
                <div style={{ position: 'relative', width: '100%', maxWidth: `${common.size.mobileWidth}px` }}>
                    {sites.map((si, key) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <HInput width="35%" label="플랫폼" variant="outlined" value={si.site_name} name="site_name" id={`site-${key.toString()}`} onChange={onChangeSites} />
                            <HInput width="60%" label="주소" variant="outlined" value={si.url} name="url" id={`url-${key.toString()}`} onChange={onChangeSites} />
                        </div>
                    ))}
                    <Fab style={{ position: 'absolute', bottom: '5px', right: '-20px', zIndex: 1 }} color="primary" aria-label="add" onClick={onClickAdd}>
                        <AddIcon />
                    </Fab>
                </div>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
                <BottomComponent>
                    <HButton width="30%" onClick={() => router.push(`/service/ministry/location?idx=${idx}`)}>
                        이전
                    </HButton>
                    <HButton width="30%" onClick={onClickNext}>
                        {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '완료'}
                    </HButton>
                </BottomComponent>
            </SiteContainer>
        </AbstractComponent>
    );
};

export default Site;
