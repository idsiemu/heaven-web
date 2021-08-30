import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import { DescribeArea, DescribeContainer, DescribeH2 } from './style';
import BottomComponent from '@components/bottom';
import { HButton } from '@components/button/styled';
import { useState, useEffect } from 'react';
import router from 'next/router';
import { IParam, IProps } from '@interfaces';
import { GET_DESCRIBE, SET_DESCRIBE } from './gql';
import { useQuery, useMutation } from '@apollo/client';
import Progress from '@components/progress';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import Header from '@components/header';
import { CircularProgress, Fab } from '@material-ui/core';
import { HInput } from '@components/input/styled';
import AddIcon from '@material-ui/icons/Add';
import { common } from '@definitions/styled-components';
import { ISite } from './type';

const Describe = (props: IProps) => {
    const { idx } = props.query as IParam;
    const [describe, setDescribe] = useState('');

    const [sites, setSites] = useState<Array<ISite>>([
        { site_name: '유튜브', url: '' },
        { site_name: '인스타그램', url: '' },
        { site_name: '그 외', url: '' }
    ]);

    const onChangeDescribe = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target;
        setDescribe(value);
    };

    const onChangeSites = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, id, value } = event.target;
        const index = id.replace(/[^0-9]/g, '');
        setSites(
            sites.map((site, idx) => {
                if (idx.toString() === index) {
                    return {
                        ...site,
                        [name]: value
                    };
                } else {
                    return {
                        ...site
                    };
                }
            })
        );
    };

    const [func, result] = useMutation(SET_DESCRIBE);

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });

    const { vertical, horizontal, open, message } = snack;

    const { loading, data, refetch } = useQuery(GET_DESCRIBE, {
        variables: {
            idx: Number(idx)
        }
    });

    const onClickAdd = () => {
        if (sites[sites.length - 1].url === '') {
            setSnack(prev => ({ ...prev, message: '입력하지 않은 주소가 있습니다.', open: true }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        } else {
            setSites(sites.concat({ site_name: '그 외', url: '' }));
        }
    };

    const onClickNext = () => {
        if (!describe) {
            setSnack(prev => ({ ...prev, open: true, message: '상세 설명을 입력해주세요.' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            return;
        }
        func({
            variables: {
                idx: Number(idx),
                describe,
                sites: sites.filter(si => si.url !== '').map(si => ({ site_name: si.site_name, url: si.url }))
            }
        });
    };

    useEffect(() => {
        if (data) {
            const {
                getDescribe: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                if (rest.data) {
                    setDescribe(rest.data.describe);
                    if (rest.data.sites.length > 0) {
                        setSites(rest.data.sites);
                    }
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
        if (result.data) {
            const {
                setDescribe: { status, location, token, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                router.push(`/service/${location}`);
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
            <DescribeContainer>
                <DescribeH2>사역 상세 설명</DescribeH2>
                <DescribeArea value={describe} onChange={onChangeDescribe} />
                <div style={{ position: 'relative', width: '100%', maxWidth: `${common.size.mobileWidth}px`, marginTop: '40px' }}>
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
                <BottomComponent>
                    <HButton width="30%" onClick={() => router.push(`/service/ministry/image?idx=${idx}`)}>
                        이전
                    </HButton>
                    <HButton width="30%" onClick={onClickNext}>
                        {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'}
                    </HButton>
                </BottomComponent>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </DescribeContainer>
        </AbstractComponent>
    );
};

export default Describe;
