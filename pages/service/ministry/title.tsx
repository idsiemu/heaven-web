import { useState } from 'react';
import AbstractComponent from '@components/abstract';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { HInput } from '@components/input/styled';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { common } from '@definitions/styled-components';
import koLocale from 'date-fns/locale/ko';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { HButton } from '@components/button/styled';
import { DocumentNode, gql, useMutation, useQuery } from '@apollo/client';
import Progress from '@components/progress';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { useRouter } from 'next/router'
import { HSnack, ISnack } from '@components/snackbar/styled';
import { useEffect } from 'react';
import { NextPageContext } from 'next';
import { CircularProgress } from '@material-ui/core';



export const getServerSideProps = async (context:NextPageContext) => {
    return {
        props : {
            query: context?.query,
            params : {}
        }
    };
  };

const TitleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

export const GET_TITLE: DocumentNode = gql`
    query getTitle($role: Int) {
        getTitle(role: $role) {
            status,
            data,
            token,
            errors {
                code,
                var,
                text
            }
        }
    }
`;

export const SET_TITLE: DocumentNode = gql`
    mutation setTitle($service:ServiceInput!) {
        setTitle(service:$service) {
            status,
            token,
            errors {
                code,
                var,
                text
            }
        }
    }
`

interface IBrief {
    open: boolean;
    value: string;
    when: Date | null;
    content: string;
}


interface IParam {
    role: number,
    index?: number
}


interface IProps {
    query: IParam,
    params: object
}


const Title = (props: IProps) => {
    const router = useRouter()
    const { role } = props.query
    const init = useQuery(GET_TITLE, {
        variables: { role: Number(role) }
    })

    const [func, result] = useMutation(SET_TITLE);

    const [brief, setBrief] = useState<Array<IBrief>>([
        {
            open: false,
            value: '',
            when: null,
            content: ''
        }
    ]);
    const [title, setTitle] = useState('');

    const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target;
        setTitle(value);
    };
    const onChangeBriefWhen = (index: number, date: Date | null) => {
        brief[index].when = date;
        if (date) {
            const month = date.getMonth() + 1;
            brief[index].value = `${date.getFullYear()}-${month < 10 ? `0${month}` : month}`;
        }
        setBrief(() => [...brief]);
    };

    const onChangePrevent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const { value } = e.target;
        let changed = value.replace(/[^0-9-]/g, '');
        if (changed.length > 7) {
            changed = changed.substring(0, 7);
        }
        brief[index].when = new Date(`${changed}-01`);
        brief[index].value = changed;
        setBrief(() => [...brief]);
    };

    const onChangeBriefContent = (index: number, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        brief[index].content = e.target.value;
        setBrief(() => [...brief]);
    };

    const onClickOpen = (index: number, open: boolean) => {
        brief[index].open = open;
        setBrief(() => [...brief]);
    };

    const onClickRemove = (index: number) => {
        brief[index].when = null;
        brief[index].value = '';
        setBrief(() => [...brief]);
    };

    const onClickPlusBrief = () => {
        brief.push({
            open: false,
            value: '',
            when: null,
            content: ''
        });
        setBrief(() => [...brief]);
    };

    const onClickNext = () => {
        if(title.length > 0){
            func({variables:
                {
                    service: {
                        role: Number(role),
                        title,
                        brief_history : brief.filter(it => it.content).map(it => ({when : it.when, content: it.content}))
                    }
                }
            })
        }else{
            setSnack(prev => ({...prev, message: '타이틀을 입력해주세요.', open:true}))
            setTimeout(() => setSnack(prev => ({...prev, message: '', open:false})), 2000);
        }
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    useEffect(() => {
        if(!role){
            router.push('/login')
        }
    }, [])

    useEffect(() => {
        if(result.data?.setTitle.status === 201){
            const cookie = useCookie()
            cookie.set(TOKEN, result.data.setTitle.token, { path: '/'})
            onClickNext()
        }else if(result.data?.setTitle.status === 200){

        }
    }, [result.data])

    if(init.loading){
        return (
            <Progress />
        )
    }

    if(init.data?.getTitle.status === 201){
        const cookie = useCookie()
        cookie.set(TOKEN, init.data.getTitle.token, { path: '/'})
        init.refetch()
        return (
            <Progress />
        )
    }

    return (
        <AbstractComponent>
            <TitleContainer>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
                    <HInput width="100%" label="타이틀" variant="outlined" name="id" value={title} onChange={onChangeTitle} />
                    <div style={{ position: 'relative', width: '100%', maxWidth: `${common.size.mobileWidth}px` }}>
                        {brief.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '30%', display: 'inline-block' }}>
                                    <DatePicker
                                        disableFuture
                                        label="년도"
                                        value={item.when}
                                        openTo="year"
                                        inputFormat="yyyy-MM"
                                        views={['year', 'month']}
                                        onChange={newValue => {
                                            onChangeBriefWhen(index, newValue);
                                        }}
                                        onMonthChange={() => onClickOpen(index, false)}
                                        onClose={() => onClickOpen(index, false)}
                                        open={item.open}
                                        renderInput={params => {
                                            const { label, inputRef } = params;
                                            return (
                                                <div style={{ position: 'relative' }}>
                                                    <TextField
                                                        label={label}
                                                        inputRef={inputRef}
                                                        InputProps={{
                                                            readOnly: true
                                                        }}
                                                        onClick={() => onClickOpen(index, true)}
                                                        value={item.value}
                                                        onChange={e => onChangePrevent(e, index)}
                                                    />
                                                    <HighlightOffIcon
                                                        style={{ position: 'absolute', right: 10, height: '100%', width: '30px', color: `${common.colors.lightGrey}`, cursor: 'pointer' }}
                                                        onClick={() => onClickRemove(index)}
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                                <HInput
                                    width="65%"
                                    value={item.content}
                                    label={`약력 ${index + 1}`}
                                    variant="outlined"
                                    name={`brief-${index}`}
                                    marginBottom="1rem"
                                    onChange={e => onChangeBriefContent(index, e)}
                                />
                            </div>
                        ))}
                        <Fab style={{ position: 'absolute', bottom: '-10px', right: '-25px' }} color="primary" aria-label="add" onClick={onClickPlusBrief}>
                            <AddIcon />
                        </Fab>
                    </div>
                </LocalizationProvider>
                <div style={{ width: '100%', maxWidth: `${common.size.mobileWidth}px`, textAlign: 'right' }}>
                    <HButton width="30%" onClick={onClickNext}>
                        {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'}
                    </HButton>
                </div>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </TitleContainer>
        </AbstractComponent>
    );
};

export default Title;
