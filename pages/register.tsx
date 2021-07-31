import { useState, useEffect } from 'react';
import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import { HInput } from '@components/input/styled';
import { HButton } from '@components/button/styled';
import Typography from '@material-ui/core/Typography';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { Box } from '@material-ui/core';
import { common } from '@definitions/styled-components';
import Router from 'next/router';
import { IRegisterPayload, sessionAction } from '@redux/features/session/slice';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackState } from '@components/snackbar/styled';
import { RootState } from '@redux/reducers';

const RegisterContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;
const Register: React.FC = () => {
    const session = useSelector((state: RootState) => state.sessionReducer);

    const [snack, setSnack] = useState<SnackState>({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message: ''
    });
    const dispatch = useDispatch();
    const [register, setRegister] = useState<IRegisterPayload>({
        id: '',
        name: '',
        phone: '',
        password: '',
        confirm: '',
        role: 1,
        device: 'WEB'
    });

    const { open, vertical, horizontal, message } = snack;
    const onChangeRole = (idx: number) => {
        setRegister(prev => ({ ...prev, role: idx }));
    };
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegister(prev => ({ ...prev, [name]: value }));
    };

    const onClickRegister = () => {
        dispatch(sessionAction.registerRequest(register));
    };

    useEffect(() => {
        if (session.error) {
            setSnack(prev => ({ ...prev, open: true, message: session.error ? session.error.text : '' }));
            setTimeout(() => setSnack(prev => ({ ...prev, open: false, message: '' })), 3000);
        } else {
            setSnack(prev => ({ ...prev, open: false, message: '' }));
        }
    }, [session.error]);

    return (
        <AbstractComponent>
            <GlobalStyle />
            <RegisterContainer>
                <ToggleButtonGroup value={register.role} exclusive style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>
                    <ToggleButton value={1} style={{ width: '50%', maxWidth: '140px' }} onClick={() => onChangeRole(1)}>
                        일반 회원
                    </ToggleButton>
                    <ToggleButton value={2} style={{ width: '50%', maxWidth: '140px' }} onClick={() => onChangeRole(2)}>
                        사역
                    </ToggleButton>
                    <ToggleButton value={3} style={{ width: '50%', maxWidth: '140px' }} onClick={() => onChangeRole(3)}>
                        찬양
                    </ToggleButton>
                </ToggleButtonGroup>
                <HInput error={session.error?.code === '100-009'} width="100%" label="이메일" variant="outlined" name="id" value={register.id} onChange={onChangeHandler} />
                <HInput width="100%" label="이름" variant="outlined" name="name" value={register.name} onChange={onChangeHandler} />
                <HInput width="100%" label="연락처" variant="outlined" name="phone" value={register.phone} onChange={onChangeHandler} />
                <HInput width="100%" label="비밀번호" variant="outlined" name="password" value={register.password} onChange={onChangeHandler} />
                <HInput width="100%" label="비밀번호 확인" variant="outlined" name="confirm" value={register.confirm} onChange={onChangeHandler} />
                <HButton width={'100%'} size="large" onClick={onClickRegister}>
                    회원가입
                </HButton>
                <Box style={{ width: '100%', maxWidth: '420px', marginTop: '1rem' }}>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                        계정이 있으신가요?
                    </Typography>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', color: common.colors.lightGrey, cursor: 'pointer' }} onClick={() => Router.push('/login')}>
                        로그인
                    </Typography>
                </Box>
            </RegisterContainer>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} onClick={() => dispatch(sessionAction.clearError())} message={message} key={vertical + horizontal} />
        </AbstractComponent>
    );
};

export default Register;
