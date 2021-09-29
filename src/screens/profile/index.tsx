import { useMutation, useQuery } from '@apollo/client';
import AbstractComponent from '@components/abstract';
import { Body } from '@components/body/style';
import BottomComponent from '@components/bottom';
import { HButton } from '@components/button/styled';
import Header from '@components/header';
import { HInput } from '@components/input/styled';
import Progress from '@components/progress';
import { common } from '@definitions/styled-components';
import GlobalStyle from '@styles/globalStyles';
import { useCookie } from 'next-cookie';
import { Fragment, useEffect, useState, useRef } from 'react';
import { TOKEN } from 'src/assets/utils/ENV';
import { EDIT_PROFILE, GET_PROFILE, SET_AVATAR } from './gql';
import router from 'next/router';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { IService } from './type';
import Avatar from '@material-ui/core/Avatar';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import generateAvatar from 'src/utils/avatar';
import { sessionAction } from '@redux/actions';
import { replacePhoneNumber } from 'src/utils/utils';
import { IProps } from '@interfaces';

const Profile: React.FC<IProps> = props => {
    const { session } = useSelector((state: RootState) => state.sessionReducer);
    const dispatch = useDispatch();
    const { loading, data, refetch } = useQuery(GET_PROFILE);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [services, setServices] = useState<Array<IService>>([]);

    const onChangeName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target;
        setName(value);
    };

    const onChangePhone = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target;
        setPhone(replacePhoneNumber(value));
    };

    // const onChangeUserInfo = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    //     const { name, value } = e.target
    //     setUserInfo(prev => ({...prev, [name]: value}))
    // }
    const [avatarMutate, avatarRes] = useMutation(SET_AVATAR);

    const [edit, editRes] = useMutation(EDIT_PROFILE);

    const fileElement = useRef<HTMLInputElement>(null);

    const onClickAvatar = e => {
        if (avatarRes.loading) {
            e.preventDefault();
        }
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const {
            target: { files }
        } = event;
        if (files) {
            avatarMutate({
                variables: {
                    avatar: files[0]
                }
            });
        }
    };

    const onClickEdit = () => {
        if (editRes.loading) {
            return;
        }
        edit({
            variables: {
                name,
                phone
            }
        });
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });

    const { vertical, horizontal, open, message } = snack;

    useEffect(() => {
        if (avatarRes.data) {
            const {
                setAvatar: { status, token, errors, data }
            } = avatarRes.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                if (fileElement.current?.files) {
                    avatarMutate({
                        variables: {
                            avatar: fileElement.current.files[0]
                        }
                    });
                }
            } else if (status === 200) {
                if (fileElement.current) {
                    fileElement.current.value = '';
                }
                dispatch(sessionAction.setAvatar(data.image));
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [avatarRes.data]);

    useEffect(() => {
        if (editRes.data) {
            const {
                editProfile: { status, token, errors }
            } = editRes.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                if (fileElement.current?.files) {
                    avatarMutate({
                        variables: {
                            avatar: fileElement.current.files[0]
                        }
                    });
                }
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [editRes.data]);

    useEffect(() => {
        if (data) {
            const {
                getProfile: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setId(rest.data.id);
                setName(rest.data.name);
                setPhone(replacePhoneNumber(rest.data.phone));
                setServices(rest.data.services);
            } else if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, rest.token, { path: '/' });
                refetch();
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, []);

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} />
            {loading ? (
                <Progress />
            ) : (
                <Fragment>
                    <Body>
                        <div style={{ marginBottom: '2rem' }}>
                            <label htmlFor="avatar" onClick={onClickAvatar} style={{ cursor: 'pointer' }}>
                                {avatarRes.loading ? <CircularProgress size={57} /> : <Avatar style={{ width: '60px', height: '60px' }} src={generateAvatar(session)} />}
                            </label>
                            <input ref={fileElement} id="avatar" type="file" style={{ display: 'none' }} onChange={onFileChange} />
                        </div>
                        <HInput name="id" label="아이디" width="100%" value={id} InputProps={{ readOnly: true }} />
                        <HInput name="name" label="이름" width="100%" value={name} onChange={onChangeName} />
                        <HInput label="연락처" name="phone" width="100%" value={phone} onChange={onChangePhone} inputProps={{ maxLength: 13 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: `${common.size.mobileWidth}px` }}>
                            {services.map((ser, key) => (
                                <HButton width="160px" onClick={() => router.push(`/service/${ser.location}`)} key={key} bgcolor={ser.init ? 'dodgerBlue' : 'orange'}>
                                    {ser.name}
                                </HButton>
                            ))}
                        </div>
                        <BottomComponent state="front">
                            <HButton width="160px" onClick={onClickEdit}>
                                {editRes.loading ? <CircularProgress style={{ color: 'white' }} /> : '적용'}
                            </HButton>
                        </BottomComponent>
                    </Body>
                </Fragment>
            )}
            <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
        </AbstractComponent>
    );
};

export default Profile;
