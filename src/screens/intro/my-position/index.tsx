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
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const MyPositionContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const GET_POSITION: DocumentNode = gql`
    query getPosition {
        getPosition {
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

const SET_POSITION: DocumentNode = gql`
    mutation setPosition($position: String!) {
        setPosition(position: $position) {
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

const myPosition: React.FC<IProps> = props => {
    const { data, refetch } = useQuery(GET_POSITION);

    const [func, result] = useMutation(SET_POSITION);

    const [position, setPosition] = useState('');
    const onChangePosition = event => {
        setPosition(event.target.value);
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
                position
            }
        });
    };

    useEffect(() => {
        if (data) {
            const {
                getPosition: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setPosition(rest.data);
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
                setPosition: { status, token, location, errors }
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
            <MyPositionContainer>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">직책</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={position} label="직책" onChange={onChangePosition}>
                        <MenuItem value={''}>선택</MenuItem>
                        <MenuItem value={'목사'}>목사</MenuItem>
                        <MenuItem value={'강도사'}>강도사</MenuItem>
                        <MenuItem value={'전도사'}>전도사</MenuItem>
                    </Select>
                </FormControl>
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyPositionContainer>
        </AbstractComponent>
    );
};

export default myPosition;
