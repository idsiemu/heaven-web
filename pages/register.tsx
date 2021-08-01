import { useState, useEffect, KeyboardEvent } from 'react';
import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import { HInput } from '@components/input/styled';
import { HButton } from '@components/button/styled';
import Typography from '@material-ui/core/Typography';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { Box, CircularProgress } from '@material-ui/core';
import { common } from '@definitions/styled-components';
import Router from 'next/router';
import { IRegisterPayload, sessionAction } from '@redux/features/session/slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { HSnack, ISnack } from '@components/snackbar/styled';

const RegisterContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

type keys = 'id' | 'name' | 'phone' | 'password' | 'confirm';

interface IValidate {
    id: IValidateState;
    name: IValidateState;
    phone: IValidateState;
    password: IValidateState;
    confirm: IValidateState;
}
interface IValidateState {
    state: 'IDLE' | 'ERROR' | 'SUCCESS';
    text: string;
}

const Register: React.FC = () => {
    const session = useSelector((state: RootState) => state.sessionReducer);

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

    const initVali: IValidate = {
        id: { state: 'IDLE', text: '' },
        name: { state: 'IDLE', text: '' },
        phone: { state: 'IDLE', text: '' },
        password: { state: 'IDLE', text: '' },
        confirm: { state: 'IDLE', text: '' }
    };
    const [validate, setValidate] = useState<IValidate>(initVali);

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const replacePhoneNumber = (phone: string) => {
        return phone
            .replace(/[^0-9]/g, '')
            .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
            .replace('--', '-');
    };

    const onChangeRole = (idx: number) => {
        setRegister(prev => ({ ...prev, role: idx }));
    };
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const changeValidate = validate[name as keys];
        if (changeValidate) {
            changeValidate.state = 'IDLE';
            changeValidate.text = '';
            setValidate(prev => ({ ...prev, ...changeValidate }));
        }
        if (name === 'phone') {
            setRegister(prev => ({ ...prev, [name]: replacePhoneNumber(value) }));
        } else {
            setRegister(prev => ({ ...prev, [name]: value }));
        }
    };

    const onClickRegister = () => {
        if (register.password !== register.confirm) {
            setValidate(prev => ({ ...prev, confirm: { state: 'ERROR', text: '비밀번호가 일치하지 않습니다.' } }));
        } else {
            dispatch(sessionAction.registerRequest(register));
        }
    };

    const onPressEnter = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            onClickRegister();
        }
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
            <RegisterContainer onKeyPress={onPressEnter}>
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
                <HInput state={validate.id.state} width="100%" label="이메일" variant="outlined" name="id" value={register.id} onChange={onChangeHandler} helperText={validate.id.text} />
                <HInput state={validate.name.state} width="100%" label="이름" variant="outlined" name="name" value={register.name} onChange={onChangeHandler} helperText={validate.name.text} />
                <HInput
                    state={validate.phone.state}
                    width="100%"
                    label="연락처"
                    variant="outlined"
                    name="phone"
                    value={register.phone}
                    onChange={onChangeHandler}
                    helperText={validate.phone.text}
                    inputProps={{ maxLength: 13 }}
                />
                <HInput
                    state={validate.password.state}
                    width="100%"
                    label="비밀번호"
                    variant="outlined"
                    name="password"
                    value={register.password}
                    onChange={onChangeHandler}
                    type="password"
                    helperText={validate.password.text}
                />
                <HInput
                    state={validate.confirm.state}
                    width="100%"
                    label="비밀번호 확인"
                    variant="outlined"
                    name="confirm"
                    value={register.confirm}
                    onChange={onChangeHandler}
                    type="password"
                    helperText={validate.confirm.text}
                />
                <HButton width={'100%'} size="large" onClick={onClickRegister}>
                    {session.loading ? <CircularProgress style={{ color: 'white' }} /> : '회원가입'}
                </HButton>
                <Box style={{ width: '100%', maxWidth: `${common.size.mobileWidth}px`, marginTop: '1rem' }}>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                        계정이 있으신가요?
                    </Typography>
                    <Typography variant="subtitle1" style={{ display: 'inline-block', color: common.colors.lightGrey, cursor: 'pointer' }} onClick={() => Router.push('/login')}>
                        로그인
                    </Typography>
                </Box>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </RegisterContainer>
        </AbstractComponent>
    );
};

export default Register;
