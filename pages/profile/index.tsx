import { useQuery } from '@apollo/client';
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
import { Fragment, useEffect, useState } from 'react';
import { TOKEN } from 'src/assets/utils/ENV';
import { GET_PROFILE } from './gql';
import router from 'next/router'
import { HSnack, ISnack } from '@components/snackbar/styled';
import { IService } from './type';
import Avatar from '@material-ui/core/Avatar';

const Profile = () => {
    const { loading, data, refetch } = useQuery(GET_PROFILE);

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const [services, setServices] = useState<Array<IService>>([])

    const onChangeName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target
        setName(value)
    }

    const onChangePhone = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target
        setPhone(value)
    }

    // const onChangeUserInfo = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    //     const { name, value } = e.target
    //     setUserInfo(prev => ({...prev, [name]: value}))
    // }

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });

    const { vertical, horizontal, open, message } = snack;

    useEffect(() => {
        if(data){
            const { getProfile : { status, errors, ...rest} } = data
            if(status === 200){
                setId(rest.data.id)
                setName(rest.data.name)
                setPhone(rest.data.phone)
                setServices(rest.data.services)
            }else if(status === 201){
                const cookie = useCookie();
                cookie.set(TOKEN, rest.token, { path: '/' });
                refetch();
            }else if(errors){
                let isBan = false;
                errors.forEach(err => {
                    if(err.code === '500-005'){
                        isBan = true;
                    }
                });
                if(isBan){
                    router.push('/');
                }else{
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [data])

    useEffect(() => {
        refetch()
    }, [])

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            {loading ?
                <Progress />
            :
                <Fragment>
                    <Body>
                        <div style={{display :'flex', flexDirection:'column', width:'100%', alignItems:'center', padding:'2rem 0'}}>
                            <div>
                                <Avatar src="/public/icons/default-avatar.png" />
                            </div>
                            <HInput name="id" label="아이디" width='100%' value={id} InputProps={{ readOnly: true }}/>
                            <HInput name="name" label="이름" width="100%" value={name} onChange={onChangeName}/>
                            <HInput label="연락처" name="phone" width="100%" value={phone} onChange={onChangePhone}/>
                            <div style={{display:'flex', justifyContent:'space-between', width:'100%', maxWidth: `${common.size.mobileWidth}px`}}>
                                {services.map((ser, key) => (<HButton width="180px" onClick={() => router.push(`/service/${ser.location}`)} key={key} bgColor={ser.init ? 'dodgerBlue' : 'orange'}>{ser.name}</HButton>))}
                            </div>
                        </div>
                    </Body>
                    <BottomComponent state="front">
                        <HButton>적용</HButton>
                    </BottomComponent>
                </Fragment>
            }
            <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
        </AbstractComponent>
    );
};

export default Profile;
