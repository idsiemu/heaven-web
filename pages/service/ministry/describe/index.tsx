import AbstractComponent from "@components/abstract"
import GlobalStyle from "@styles/globalStyles"
import { DescribeArea, DescribeContainer, DescribeH2 } from "./style"
import { NextPageContext } from 'next';
import BottomComponent from "@components/bottom";
import { HButton } from "@components/button/styled";
import { useState, useEffect } from 'react'
import router from 'next/router';
import { IParam, IProps } from "@interfaces";
import { GET_DESCRIBE, SET_DESCRIBE } from "./gql";
import { useQuery, useMutation } from "@apollo/client";
import Progress from "@components/progress";
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { HSnack, ISnack } from '@components/snackbar/styled';

export const getServerSideProps = (context: NextPageContext) => {
    const { idx } = context.query;
    if (!idx) {
        if(context.res){
            context.res.writeHead(301, {
                Location: '/'
            });
            context.res.end();
        }
    }
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

const Describe = (props: IProps) => {
    const { idx } = props.query as IParam
    const [describe, setDescribe] = useState('');
    const onChangeDescribe = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target
        setDescribe(value)
    }

    const [func, result] = useMutation(SET_DESCRIBE);


    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });

    const { vertical, horizontal, open, message } = snack;

    const { loading, data, refetch } = useQuery(GET_DESCRIBE, {
        variables: {
            idx: Number(idx)
        }
    });

    const onClickNext = () => {
        if(!describe){
            setSnack(prev => ({ ...prev, open: true, message: '상세 설명을 입력해주세요.' }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
            return
        }
        func({
            variables : {
                idx : Number(idx),
                describe
            }
        })
    }

    useEffect(() => {
        if(data){
            const { getDescribe : { status, errors, ...rest} } = data
            if(status === 200){
                if(rest.data){
                    setDescribe(rest.data)
                }
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
        if(result.data){
            const { setDescribe : { status, location, token, errors } } = result.data
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext()
            } else if (status === 200) {
                router.push(`/service/${location}`)
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

    useEffect(() => {
        refetch()
    }, [])

    if (loading) {
        return <Progress />
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <DescribeContainer>
                <DescribeH2>
                    사역 상세 설명
                </DescribeH2>
                <DescribeArea value={describe} onChange={onChangeDescribe}/>
                <BottomComponent>
                    <HButton width="30%" onClick={() => router.push(`/service/ministry/image?idx=${idx}`)}>
                        이전
                    </HButton>
                    <HButton width="30%" onClick={onClickNext}>
                        다음
                    </HButton>
                </BottomComponent>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </DescribeContainer>
        </AbstractComponent>
    )
}

export default Describe