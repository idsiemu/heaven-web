import { useState, useEffect } from 'react';
import GlobalStyle from '@styles/globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import { sessionAction } from '@redux/actions';
import AbstractComponent from '@components/abstract';
import { KaKaoBtn } from '@components/button/styled';
import { RootState } from '@redux/reducers';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { KAKAO_JS_KEY } from 'src/assets/utils/ENV';

const LoginContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

const Login: React.FC = () => {
    const session = useSelector((state: RootState) => state.sessionReducer);

    const dispatch = useDispatch();

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

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
            <LoginContainer>
                <KaKaoBtn token={KAKAO_JS_KEY} onSuccess={onSuccess} onFail={onFailure}>
                    <span>카카오 계정으로 로그인</span>
                </KaKaoBtn>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </LoginContainer>
        </AbstractComponent>
    );
};

export default Login;
