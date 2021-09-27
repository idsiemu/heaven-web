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

const MyRoleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: 440px;
        padding: 2rem;
    }
`;

const SET_ROLE: DocumentNode = gql`
    mutation setRole($role: Int!) {
        setRole(role: $role) {
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

const myRole: React.FC = () => {
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
                service: {
                    role: role
                }
            }
        });
    };

    useEffect(() => {
        if (result.data) {
            const {
                setBrief: { status, token, location, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                router.push(location);
            } else if (errors) {
                setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        }
    }, [result.data]);
    return (
        <AbstractComponent>
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
                <HButton width="30%" style={{ marginTop: '30px' }}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyRoleContainer>
        </AbstractComponent>
    );
};

export default myRole;
