import { useState, useEffect, KeyboardEvent } from 'react';
import GlobalStyle from '@styles/globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import { sessionAction } from '@redux/actions';
import AbstractComponent from '@components/abstract';
import { ILoginPayload } from '@redux/features/session/slice';
import { HInput } from '@components/input/styled';
import { HButton, KaKaoBtn } from '@components/button/styled';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { common } from '@definitions/styled-components';
import router from 'next/router';
import { RootState } from '@redux/reducers';
import { HSnack, ISnack } from '@components/snackbar/styled';
import axios from 'axios';
import { KAKAO_JS_KEY } from 'src/assets/utils/ENV';

const LoginContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

type keys = 'id' | 'password';

interface IValidate {
    id: IValidateState;
    password: IValidateState;
}
interface IValidateState {
    state: 'IDLE' | 'ERROR' | 'SUCCESS';
    text: string;
}

const Login: React.FC = () => {
    const session = useSelector((state: RootState) => state.sessionReducer);

    const dispatch = useDispatch();
    const [submit, setSubmit] = useState<ILoginPayload>({
        id: '',
        password: '',
        device: 'WEB'
    });

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const initVali: IValidate = {
        id: { state: 'IDLE', text: '' },
        password: { state: 'IDLE', text: '' }
    };
    const [validate, setValidate] = useState<IValidate>({
        id: { state: 'IDLE', text: '' },
        password: { state: 'IDLE', text: '' }
    });

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const changeValidate = validate[name as keys];
        if (changeValidate) {
            changeValidate.state = 'IDLE';
            changeValidate.text = '';
            setValidate(prev => ({ ...prev, ...changeValidate }));
        }
        setSubmit(prev => ({ ...prev, [name]: value }));
    };

    const onClickLogin = () => {
        dispatch(sessionAction.loginRequest(submit));
    };

    const onPressEnter = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            onClickLogin();
        }
    };

    const onSuccess = (data: any) => {
        const sendData = {
            access_token: data.response.access_token,
            refresh_token: data.response.refresh_token,
            device: 'WEB'
        };
        dispatch(sessionAction.kakaoRequest(sendData));
    };

    const onFailure = (data: any) => {
        alert(data);
    };

    useEffect(() => {
        if (session.errors) {
            session.errors.forEach(error => {
                const vali = validate[error.var as keys];
                if (vali) {
                    vali.state = 'ERROR';
                    vali.text = error.text ? error.text : '';
                }
            });
            setValidate(prev => ({ ...prev, ...validate }));
        } else {
            setValidate(prev => ({ ...prev, ...initVali }));
        }
    }, [session.errors]);

    useEffect(() => {
        return () => {
            dispatch(sessionAction.clearError());
        };
    }, []);

    useEffect(() => {
        if (session.snack) {
            const text = session.snack[0].text;
            setSnack(prev => ({ ...prev, open: true, message: text ? text : '' }));
            setTimeout(() => dispatch(sessionAction.setSnack(null)), 2000);
        } else {
            setSnack(prev => ({ ...prev, open: false, message: '' }));
        }
    }, [session.snack]);

    return (
        <AbstractComponent>
            <GlobalStyle />
            {/* <LoginContainer onKeyPress={onPressEnter}> */}
            <LoginContainer>
                {/* <HInput state={validate.id.state} name="id" label="이메일" variant="outlined" width={'100%'} value={submit.id} onChange={onChangeHandler} helperText={validate.id.text} />
                <HInput
                    state={validate.password.state}
                    name="password"
                    label="비밀번호"
                    variant="outlined"
                    width={'100%'}
                    value={submit.password}
                    onChange={onChangeHandler}
                    type="password"
                    helperText={validate.password.text}
                /> */}
                {/* <HButton type="button" width={'100%'} size="large" onClick={onClickLogin}>
                    {session.loading ? <CircularProgress style={{ color: 'white' }} /> : '로그인'}
                </HButton> */}
                <KaKaoBtn token={KAKAO_JS_KEY} onSuccess={onSuccess} onFail={onFailure}>
                    <span>카카오 계정으로 로그인</span>
                </KaKaoBtn>
                {/* <Box style={{ width: '100%', maxWidth: `${common.size.mobileWidth}px`, marginTop: '1rem' }}>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                        계정이 없으신가요?
                    </Typography>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', color: common.colors.lightGrey, cursor: 'pointer' }} onClick={() => router.push('/register')}>
                        회원가입
                    </Typography>
                </Box> */}
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </LoginContainer>
        </AbstractComponent>
    );
};

export default Login;
