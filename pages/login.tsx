import { useState } from 'react';
import { Wrapper } from '@components/wrapper';
import { RootState } from '@redux/reducers';
import GlobalStyle from '@styles/globalStyles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { sessionAction } from '@redux/actions';
import Router from 'next/router';
import AbstractComponent from '@components/abstract';
import { ILoginPayload } from '@redux/features/session/slice';

interface ITextFeild {
    width?: string;
}

const HTextField = styled(TextField)<ITextFeild>`
    && {
        width: ${props => (props.width ? props.width : 'auto')};
        margin-bottom: 2rem;
        & .Mui-focused {
            color: ${({ theme }) => theme.colors.hoverGrey};
            fieldset {
                border-color: ${({ theme }) => theme.colors.hoverGrey};
            }
        }
    }
`;

const LoginContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

interface IButton {
    width?: string;
}

const HButton = styled(Button)<IButton>`
    width: ${props => props.width};
    height: 55px;
    && {
        color: ${({ theme }) => theme.colors.white};
        background: ${({ theme }) => theme.colors.blackGrey};
        &:hover {
            background: ${({ theme }) => theme.colors.hoverGrey};
        }
    }
`;
const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState<ILoginPayload>({
        id: '',
        password: '',
        device: 'W'
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
            <Wrapper>
                <GlobalStyle />
                <LoginContainer>
                    <HTextField name="id" label="이메일" variant="outlined" width={'30rem'} value={submit.id} onChange={onChangeHandler} />
                    <HTextField name="password" label="비밀번호" variant="outlined" width={'30rem'} value={submit.password} onChange={onChangeHandler} type="password" />
                    <HButton width={'30rem'} size="large" onClick={onClickLogin}>
                        로그인
                    </HButton>
                </LoginContainer>
            </Wrapper>
        </AbstractComponent>
    );
};

export default Login;
