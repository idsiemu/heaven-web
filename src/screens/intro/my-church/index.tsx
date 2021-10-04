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
import { GQL_DOMAIN, TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { common } from '@definitions/styled-components';
import { IProps } from '@interfaces';
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { HInput } from '@components/input/styled';
import { NameNode, OperationDefinitionNode } from 'graphql';
import axiosApiInstance from 'src/axios';

const MyChurchContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: ${common.size.mobileWidth + 'px'};
        padding: 98px 1.25rem 1.25rem 1.25rem;
    }
`;

const CHURCH_PAGE_SET: DocumentNode = gql`
    query churchPageSet {
        churchPageSet {
            status
            data {
                locations {
                    idx
                    location
                }
                myChurch {
                    idx
                    name
                    address
                    address_road
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

const query = `
    query getLocationDetail($idx: Int!) {
        getLocationDetail(idx: $idx) {
            status
            data
            token
            errors {
                code
                var
                text
            }
        }
    }`;

const DETAIL_LOCATIONN: DocumentNode = gql`
    ${query}
`;

const churchQuery = `
    query getChurchList($location_idx: Int!, $detail: String, $name: String!) {
        getChurchList(location_idx: $location_idx, detail: $detail, name: $name) {
            status
            data {
                idx
                name
                address
                address_road
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

const CHURCH_LIST: DocumentNode = gql`
    ${churchQuery}
`;

interface ChurchInfo {
    idx: number;
    name: string;
    address: string;
    address_road?: string;
}

const myChurch: React.FC<IProps> = props => {
    const { data, refetch } = useQuery(CHURCH_PAGE_SET);

    const [location, setLocation] = useState(0);
    const [locations, setLocations] = useState<Array<{ idx: number; location: string }>>([]);
    const [detail, setDetail] = useState('전체');
    const [details, setDetails] = useState([]);
    const [church, setChurch] = useState('');
    const [churchList, setChurchList] = useState<Array<ChurchInfo>>([]);
    const [churchIdx, setChurchIdx] = useState(0);
    const onChangeLocation = e => {
        const { value } = e.target;
        setLocation(value);
    };

    const onChangeDetail = e => {
        const { value } = e.target;
        setDetail(value);
    };

    const onChangeChurch = e => {
        const { value } = e.target;
        setChurch(value);
    };

    const onChangeChurchIdx = e => {
        const { value } = e.target;
        setChurchIdx(Number(value));
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const onClickSubmit = () => {
        if (location) {
            if (church) {
                const innerQuery = CHURCH_LIST.definitions[0] as OperationDefinitionNode;
                const { value } = innerQuery.name as NameNode;
                axiosApiInstance(value)
                    .post(`${GQL_DOMAIN}`, {
                        query: `${churchQuery}`,
                        variables: {
                            location_idx: location,
                            detail,
                            name: church
                        }
                    })
                    .then(res => {
                        setChurchList(res.data[value].data);
                    });
            } else {
                setSnack(prev => ({ ...prev, open: true, message: '교회 이름을 입력해주세요.' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        } else {
            setSnack(prev => ({ ...prev, open: true, message: '지역을 선택해주세요.' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        }
        console.log(location, detail, church);
    };

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

    useEffect(() => {
        if (location) {
            const innerQuery = DETAIL_LOCATIONN.definitions[0] as OperationDefinitionNode;
            const { value } = innerQuery.name as NameNode;
            axiosApiInstance(value)
                .post(`${GQL_DOMAIN}`, {
                    query: `${query}`,
                    variables: {
                        idx: location
                    }
                })
                .then(res => {
                    setDetails(res.data[value].data);
                });
        } else {
            setDetails([]);
        }
    }, [location]);

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} back_url="/intro/my-intro" />
            <MyChurchContainer>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">지역선택</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={location} label="지역선택" onChange={onChangeLocation}>
                        {locations.map((lo, index) => (
                            <MenuItem key={index} value={lo.idx}>
                                {lo.location}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {details.length > 0 && (
                    <FormControl fullWidth style={{ marginTop: '1.25rem' }}>
                        <InputLabel id="demo-simple-select-label">상세지역</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={detail} label="상세지역" onChange={onChangeDetail}>
                            {details.map((lo, index) => (
                                <MenuItem key={index} value={lo}>
                                    {lo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <div style={{ marginTop: '1.25rem', width: '100%', position: 'relative' }}>
                    <HInput width="100%" label="교회 검색하기" variant="outlined" value={church} onChange={onChangeChurch} />
                    <IconButton aria-label="search" size="small" style={{ position: 'absolute', right: 5, top: 6, background: 'white' }} onClick={onClickSubmit}>
                        <SearchIcon fontSize="large" />
                    </IconButton>
                </div>
                {churchList.length > 0 && (
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup value={churchIdx ? churchIdx : churchList[0].idx} name="radio-buttons-group" onChange={onChangeChurchIdx}>
                            {churchList.map(ch => (
                                <FormControlLabel
                                    key={ch.idx}
                                    value={ch.idx}
                                    control={<Radio />}
                                    style={{ marginBottom: '1.25rem' }}
                                    label={
                                        <div>
                                            <div>{ch.name}</div>
                                            <div>{ch.address_road ? ch.address_road : ch.address}</div>
                                        </div>
                                    }
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
                <HButton width="30%" style={{ marginTop: '1.25rem' }} onClick={onClickNext}>
                    다음
                </HButton>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </MyChurchContainer>
        </AbstractComponent>
    );
};

export default myChurch;
