import { useState } from 'react';
import GlobalStyle from '@styles/globalStyles';
import { useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import { sessionAction } from '@redux/actions';
import AbstractComponent from '@components/abstract';
import { ILoginPayload } from '@redux/features/session/slice';
import { HInput } from '@components/input/styled';
import { HButton } from '@components/button/styled';
import { Box, Typography } from '@material-ui/core';
import { common } from '@definitions/styled-components';
import router from 'next/router';

const LoginContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;
const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState<ILoginPayload>({
        id: '',
        password: '',
        device: 'WEB'
    });
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSubmit(prev => ({ ...prev, [name]: value }));
    };

    const onClickLogin = () => {
        dispatch(sessionAction.loginRequest(submit));
    };
    return (
        <AbstractComponent>
            <GlobalStyle />
            <LoginContainer>
                <HInput name="id" label="이메일" variant="outlined" width={'100%'} value={submit.id} onChange={onChangeHandler} />
                <HInput name="password" label="비밀번호" variant="outlined" width={'100%'} value={submit.password} onChange={onChangeHandler} type="password" />
                <HButton width={'100%'} size="large" onClick={onClickLogin}>
                    로그인
                </HButton>
                <Box style={{ width: '100%', maxWidth: '440px', marginTop: '1rem' }}>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                        계정이 없으신가요?
                    </Typography>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', color: common.colors.lightGrey, cursor: 'pointer' }} onClick={() => router.push('/register')}>
                        회원가입
                    </Typography>
                </Box>
            </LoginContainer>
        </AbstractComponent>
    );
};

export default Login;
