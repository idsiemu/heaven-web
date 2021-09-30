import AbstractComponent from '@components/abstract';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { HButton } from '@components/button/styled';
import { useState, useEffect } from 'react';
import { DocumentNode, gql, useMutation, useQuery } from '@apollo/client';
import router from 'next/router';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { common } from '@definitions/styled-components';
import { IProps } from '@interfaces';
import { HInput } from '@components/input/styled';

const MyTeamNameContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const GET_TEAM_NAME: DocumentNode = gql`
    query getTeamName {
        getTeamName {
            status
            data
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

const SET_TEAM_NAME: DocumentNode = gql`
    mutation setTeamName($name: String!) {
        setTeamName(name: $name) {
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

const myTeamName: React.FC<IProps> = props => {
    const { data, refetch } = useQuery(GET_TEAM_NAME);

    const [func, result] = useMutation(SET_TEAM_NAME);

    const [name, setName] = useState('');
    const onChangeName = event => {
        setName(event.target.value);
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onClickNext = () => {
        func({
            variables: {
                name
            }
        });
    };

    useEffect(() => {
        if (data) {
            const {
                getTeamName: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setName(rest.data);
            } else if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, rest.token, { path: '/' });
                refetch();
            } else if (errors) {
                setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        }
    }, [data]);

    useEffect(() => {
        if (result.data) {
            const {
                setTeamName: { status, token, location, errors }
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
            <GlobalStyle />
            <Header history={props.history} back_url="/intro/my-intro" />
            <MyTeamNameContainer>
                <HInput width="100%" label="팀 혹은 단체명" variant="outlined" name="name" value={name} onChange={onChangeName} />
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyTeamNameContainer>
        </AbstractComponent>
    );
};

export default myTeamName;
