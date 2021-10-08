import AbstractComponent from "@components/abstract"
import { Body } from "@components/body/style"
import Header from "@components/header"
import { IParam, IProps } from "@interfaces"
import GlobalStyle from "@styles/globalStyles"
import { HH2 } from '@components/text';
import { Checkbox, CircularProgress } from "@material-ui/core"
import { HFormControlLabel, HFormGroup } from "@components/checkbox/style"
import BottomComponent from "@components/bottom"
import { HButton } from "@components/button/styled"
import { GET_AGES, SET_AGES } from "./gql"
import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { IAge } from "./type"
import { useCookie } from "next-cookie"
import { TOKEN } from "src/assets/utils/ENV"
import { HSnack, ISnack } from "@components/snackbar/styled"
import router from 'next/router';
import Progress from "@components/progress"

const Age: React.FC<IProps> = props => {
    const { idx } = props.query as IParam;
    const [ages, setAges] = useState<Array<IAge>>([])
    const { loading, data, refetch } = useQuery(GET_AGES, {
        variables: {
            idx: Number(idx)
        }
    });

    const [func, result] = useMutation(SET_AGES);

    const onClickAge = (index: number, state: boolean) => {
        if(index){
            let count = 0
            setAges(prev => [...prev.map(ag => {
                if(ag.idx === index){
                    if(!state){
                        count++
                    }
                    return {
                        ...ag,
                        state: !state
                    }
                }else{
                    if(ag.state && ag.idx){
                        count++
                    }
                }
                if(!ag.idx){
                    if(count === ages.length - 1){
                        return {
                            ...ag,
                            state: true
                        }
                    }else{
                        return {
                            ...ag,
                            state: false
                        }
                    }
                }
                return ag
            })])
        }else{
            setAges(prev => [...prev.map(ag => ({...ag, state: !state}))])
        }
    }

    const onClickNext = () => {
        const array: Array<number> = []
        ages.forEach(ag => {
            if(ag.state && ag.idx){
                array.push(ag.idx);
            }
        })
        func({
            variables: {
                idx: Number(idx),
                ages: array
            }
        })
    }

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;
    
    useEffect(() => {
        if (data) {
            const {
                getAge: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setAges(rest.data);
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
        if (result.data) {
            const {
                setAge: { status, location, token, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                if (location) {
                    router.push(`/service/${location}`);
                } else {
                    router.push('/');
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
    }, [result.data]);

    if (loading) {
        return <Progress />;
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} back_url={`/service/ministry/location?idx=${idx}`}/>
            <Body>
            <HH2>
                초청 연령대는 어떻게 되나요?
            </HH2>
            <HFormGroup>
                {ages.map(ag => (<HFormControlLabel key={ag.idx} data-checked={ag.state} control={<Checkbox checked={ag.state} onClick={() => onClickAge(ag.idx, ag.state)} />} label={ag.age} />))}
            </HFormGroup>
            <BottomComponent state="single">
                <HButton width="30%" onClick={onClickNext}>
                    {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'}
                </HButton>
            </BottomComponent>
            <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </Body>
        </AbstractComponent>
    )
}

export default Age