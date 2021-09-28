import AbstractComponent from '@components/abstract';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { HButton } from '@components/button/styled';
import { useState, useEffect } from 'react';
import { DocumentNode, gql, useMutation } from '@apollo/client';
import router from 'next/router';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { HInput } from '@components/input/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { sessionAction } from '@redux/actions';
import { common } from '@definitions/styled-components';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';

const MyIntroContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const SET_MY_ROLE: DocumentNode = gql`
    mutation setMyName($name: String!) {
        setMyName(name: $name) {
            status
            data {
                name
            }
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

const myIntro: React.FC = () => {
    const session = useSelector((state: RootState) => state.sessionReducer);
    const dispatch = useDispatch();

    const [func, result] = useMutation(SET_MY_ROLE);

    const [name, setName] = useState('');
    const [role, setRole] = useState(1);

    const onChangeName = e => {
        const { value } = e.target;
        setName(value);
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onClickNext = () => {
        if (name) {
            func({
                variables: {
                    name
                }
            });
        } else {
            setSnack(prev => ({ ...prev, open: true, message: '이름을 입력해주세요' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        }
    };

    useEffect(() => {
        if (session.session) {
            setName(session.session.name ? session.session.name : '');
            let myRole = 1;
            session.session.role.some(ro => {
                if (ro.role_idx !== 1) {
                    myRole = ro.role_idx;
                    return true;
                } else {
                    return false;
                }
            });
            setRole(myRole);
        }
    }, [session.session]);

    useEffect(() => {
        if (result.data) {
            const {
                setMyName: { status, token, location, errors, ...rest }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                dispatch(sessionAction.setName(rest.data.name));
                router.push(`/intro${location}`);
            } else if (errors) {
                setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        }
    }, [result.data]);
    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            <MyIntroContainer>
                <HInput width="100%" label={role === 3 ? '대표명' : '이름'} variant="outlined" name="name" value={name} onChange={onChangeName} />
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyIntroContainer>
        </AbstractComponent>
    );
};

export default myIntro;
