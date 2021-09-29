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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { sessionAction } from '@redux/actions';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { common } from '@definitions/styled-components';
import { IProps } from '@interfaces';

const MyRoleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const SET_ROLE: DocumentNode = gql`
    mutation setRole($role: Int!) {
        setRole(role: $role) {
            status
            data {
                role {
                    role_idx
                }
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

const myRole: React.FC<IProps> = props => {
    const session = useSelector((state: RootState) => state.sessionReducer);
    const dispatch = useDispatch();

    const [func, result] = useMutation(SET_ROLE);

    const [role, setRole] = useState(1);

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onChangeRole = (idx: number) => {
        setRole(idx);
    };
    const onClickNext = () => {
        func({
            variables: {
                role
            }
        });
    };

    useEffect(() => {
        if (session.session) {
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
                setRole: { status, token, location, errors, ...rest }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                dispatch(sessionAction.setRole(rest.data.role));
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
            <Header history={props.history} />
            <MyRoleContainer>
                <ToggleButtonGroup value={role} exclusive style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} orientation="vertical">
                    <ToggleButton value={1} style={{ width: '100%' }} onClick={() => onChangeRole(1)}>
                        일반 회원
                    </ToggleButton>
                    <ToggleButton value={2} style={{ width: '100%' }} onClick={() => onChangeRole(2)}>
                        말씀 사역
                    </ToggleButton>
                    <ToggleButton value={3} style={{ width: '100%' }} onClick={() => onChangeRole(3)}>
                        찬양 사역
                    </ToggleButton>
                </ToggleButtonGroup>
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyRoleContainer>
        </AbstractComponent>
    );
};

export default myRole;
