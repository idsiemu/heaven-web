import AbstractComponent from '@components/abstract';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { HButton } from '@components/button/styled';
import { useState, useEffect } from 'react';
import { DocumentNode, gql, useMutation } from '@apollo/client';
import router from 'next/router';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { common } from '@definitions/styled-components';
import { IProps } from '@interfaces';
import { HInput } from '@components/input/styled';
import { RootState } from '@redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { replacePhoneNumber } from 'src/utils/utils';

const MyPhoneContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const GET_VERIFY_CODE: DocumentNode = gql`
    mutation getVerifyCode($phone: String!) {
        getVerifyCode(phone: $phone) {
            status
            token
            location
            errors {
                code
                var
                text
            }
        }
    }
`;

const SET_MY_PHONE: DocumentNode = gql`
    mutation setMyPhone($code: String!) {
        setMyPhone(code: $code) {
            status
            token
            location
            errors {
                code
                var
                text
            }
        }
    }
`;

const myPhone: React.FC<IProps> = props => {
    const session = useSelector((state: RootState) => state.sessionReducer);
    const [func, result] = useMutation(GET_VERIFY_CODE);
    const [func2, result2] = useMutation(SET_MY_PHONE);

    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [verify, setVerify] = useState(false);
    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onChangePhone = e => {
        const { value } = e.target;
        setConfirm(false);
        setPhone(replacePhoneNumber(value));
    };

    const onChangeCode = e => {
        const { value } = e.target;
        const set = value.replace(/[^0-9]/g, '');
        setCode(set);
        if (set.length === 6) {
            setVerify(true);
        } else {
            setVerify(false);
        }
    };

    const onClickConfirm = (confirm: boolean) => {
        if (confirm) {
            if (verify) {
                if (!result2.loading) {
                    func2({
                        variables: {
                            code
                        }
                    });
                }
            } else {
                setSnack(prev => ({ ...prev, open: true, message: '인증코드 6자리를 입력해주세요.' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        } else {
            if (phone.length === 13) {
                if (!result.loading) {
                    func({
                        variables: {
                            phone
                        }
                    });
                    setConfirm(true);
                }
            } else {
                setSnack(prev => ({ ...prev, open: true, message: '전화번호 13자리를 입력해주세요.' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        }
    };

    useEffect(() => {
        if (session.session) {
            setPhone(session.session.phone ? session.session.phone : '');
        }
    }, [session.session]);

    useEffect(() => {
        if (result.data) {
            const {
                getVerifyCode: { status, token, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                func({
                    variables: {
                        phone
                    }
                });
            } else if (errors) {
                setConfirm(false);
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '100-007') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/login');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [result.data]);

    useEffect(() => {
        if (result2.data) {
            const {
                setMyPhone: { status, location, token, errors }
            } = result2.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                func2({
                    variables: {
                        code
                    }
                });
            } else if (status === 200) {
                router.push(location);
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '100-007') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/login');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [result2.data]);

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} back_url="/intro/my-church" />
            <MyPhoneContainer>
                <HInput width="100%" label="연락처" variant="outlined" value={phone} onChange={onChangePhone} inputProps={{ maxLength: 13 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <HInput width="65%" label="인증번호" variant="outlined" value={code} onChange={onChangeCode} inputProps={{ maxLength: 6 }} />
                    <HButton width="30%" onClick={() => onClickConfirm(confirm)}>
                        {confirm ? '확인' : '인증요청'}
                    </HButton>
                </div>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyPhoneContainer>
        </AbstractComponent>
    );
};

export default myPhone;
