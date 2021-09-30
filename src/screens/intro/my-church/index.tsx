import AbstractComponent from '@components/abstract';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { HButton } from '@components/button/styled';
import { useState, useEffect } from 'react';
import { DocumentNode, gql, useMutation, useQuery } from '@apollo/client';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import router from 'next/router';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { common } from '@definitions/styled-components';
import { IProps } from '@interfaces';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { HInput } from '@components/input/styled';

const MyChurchContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem;
    }
`;

const CHURCH_PAGE_SET: DocumentNode = gql`
    query churchPageSet {
        churchPageSet {
            status
            data {
                locations
                myChurch {
                    idx
                    address
                    address_load
                }
            }
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

const myChurch: React.FC<IProps> = props => {
    const { data, refetch, ...rest } = useQuery(CHURCH_PAGE_SET);

    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const onChangeLocation = event => {
        setLocation(event.target.value);
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onClickNext = () => {};

    useEffect(() => {
        if (data) {
            const {
                churchPageSet: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setLocations(rest.data.locations);
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

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} back_url="/intro/my-intro" />
            <MyChurchContainer>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">지역선택</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={location} label="지역선택" onChange={onChangeLocation}>
                        <MenuItem value={''}>지역선택</MenuItem>
                        {locations.map((lo, index) => (
                            <MenuItem key={index} value={lo}>
                                {lo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div style={{ marginTop: '1.25rem', width: '100%', position: 'relative' }}>
                    <HInput width="100%" label="교회 검색하기" variant="outlined" />
                    <IconButton aria-label="search" size="small" style={{ position: 'absolute', right: 5, top: 6, background: 'white' }}>
                        <SearchIcon fontSize="large" />
                    </IconButton>
                </div>
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyChurchContainer>
        </AbstractComponent>
    );
};

export default myChurch;
