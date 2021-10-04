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
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
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

const SET_MY_CHURCH: DocumentNode = gql`
    mutation setMyChurch($church_idx: Int!) {
        setMyChurch(church_idx: $church_idx) {
            status
            location
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
    const [func, result] = useMutation(SET_MY_CHURCH);

    const [location, setLocation] = useState(0);
    const [locations, setLocations] = useState<Array<{ idx: number; location: string }>>([]);
    const [myChurch, setMyChurch] = useState<ChurchInfo | null>(null);
    const [detail, setDetail] = useState('전체');
    const [details, setDetails] = useState([]);
    const [churchName, setChurchName] = useState('');
    const [churchList, setChurchList] = useState<Array<ChurchInfo>>([]);
    const [churchIdx, setChurchIdx] = useState(0);

    const onChangeLocation = e => {
        const { value } = e.target;
        setLocation(value);
        setDetail('전체');
        setDetails([]);
    };

    const onChangeDetail = e => {
        const { value } = e.target;
        setDetail(value);
    };

    const onChangeChurchName = e => {
        const { value } = e.target;
        setChurchName(value);
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

    const loadDetail = (idx: number) => {
        const innerQuery = DETAIL_LOCATIONN.definitions[0] as OperationDefinitionNode;
        const { value } = innerQuery.name as NameNode;
        axiosApiInstance(value)
            .post(`${GQL_DOMAIN}`, {
                query: `${query}`,
                variables: {
                    idx
                }
            })
            .then(res => {
                setDetails(res.data[value].data);
            });
    };
    const onClickSubmit = (loc: number, cname: string) => {
        if (loc) {
            if (cname) {
                const innerQuery = CHURCH_LIST.definitions[0] as OperationDefinitionNode;
                const { value } = innerQuery.name as NameNode;
                axiosApiInstance(value)
                    .post(`${GQL_DOMAIN}`, {
                        query: `${churchQuery}`,
                        variables: {
                            location_idx: loc,
                            detail,
                            name: cname
                        }
                    })
                    .then(res => {
                        const list = res.data[value].data;
                        if (list) {
                            if (list.length > 0) {
                                if (!myChurch) {
                                    setChurchIdx(list[0].idx);
                                }
                            }
                            setChurchList(list);
                        }
                    });
            } else {
                setSnack(prev => ({ ...prev, open: true, message: '교회 이름을 입력해주세요.' }));
                setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            }
        } else {
            setSnack(prev => ({ ...prev, open: true, message: '지역을 선택해주세요.' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        }
    };

    const onClickNext = () => {
        if (churchIdx) {
            func({
                variables: {
                    church_idx: churchIdx
                }
            });
        } else {
            setSnack(prev => ({ ...prev, open: true, message: '선택된 교회가 없습니다.' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
        }
    };

    const onPressEnter = e => {
        if (e.code === 'Enter') {
            onClickSubmit(location, churchName);
        }
    };

    useEffect(() => {
        if (data) {
            const {
                churchPageSet: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setLocations(rest.data.locations);
                if (rest.data.myChurch) {
                    const splited = rest.data.myChurch.address.split(' ');
                    setMyChurch(rest.data.myChurch);
                    setChurchName(rest.data.myChurch.name);
                    rest.data.locations.some(lo => {
                        if (lo.location === splited[0]) {
                            setLocation(lo.idx);
                            setDetail(splited[1]);
                            loadDetail(lo.idx);
                            onClickSubmit(lo.idx, rest.data.myChurch.name);
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
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
            loadDetail(location);
        } else {
            setDetails([]);
        }
    }, [location]);

    useEffect(() => {
        if (result.data) {
            const {
                setMyChurch: { status, token, location, errors }
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
                    <HInput width="100%" label="교회 검색하기" variant="outlined" value={churchName} onChange={onChangeChurchName} onKeyPress={onPressEnter} />
                    <IconButton aria-label="search" size="small" style={{ position: 'absolute', right: 5, top: 6, background: 'white' }} onClick={() => onClickSubmit(location, churchName)}>
                        <SearchIcon fontSize="large" />
                    </IconButton>
                </div>
                {churchList.length > 0 && (
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup value={churchIdx} name="radio-buttons-group" onChange={onChangeChurchIdx}>
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
