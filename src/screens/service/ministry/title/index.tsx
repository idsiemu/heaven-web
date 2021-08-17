import { useState } from 'react';
import AbstractComponent from '@components/abstract';
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
import { DocumentNode, gql, useMutation } from '@apollo/client';
import Progress from '@components/progress';
import { useCookie } from 'next-cookie';
import { HSnack, ISnack } from '@components/snackbar/styled';
import { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { NameNode, OperationDefinitionNode } from 'graphql';
import axiosApiInstance from 'src/axios';
import { GQL_DOMAIN, TOKEN } from 'src/assets/utils/ENV';
import GlobalStyle from '@styles/globalStyles';
import Router from 'next/router';
import { IProps } from '@interfaces';
import BottomComponent from '@components/bottom';
import { IBrief, IParam } from './type';
import { TitleContainer } from './style';
import { SET_TITLE } from './gql';
import Header from '@components/header';

const Title = (props: IProps) => {
    const { role, idx } = props.query as IParam;

    const [isMutate, setIsMutate] = useState(false);
    const [loading, setLoading] = useState(true);
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
        setIsMutate(true);
    };

    const onChangePrevent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const { value } = e.target;
        console.log(value);
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
        setIsMutate(true);
    };

    const onClickOpen = (index: number, open: boolean) => {
        brief[index].open = open;
        setBrief(() => [...brief]);
    };

    const onClickRemove = (index: number) => {
        brief[index].when = null;
        brief[index].value = '';
        setBrief(() => [...brief]);
        setIsMutate(true);
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
        if (title.length > 0) {
            func({
                variables: {
                    service: {
                        idx: Number(idx),
                        role: Number(role),
                        title,
                        brief_history: brief.filter(it => it.content).map(it => ({ when: it.when, content: it.content })),
                        is_mutate: isMutate
                    }
                }
            });
        } else {
            setSnack(prev => ({ ...prev, message: '타이틀을 입력해주세요.', open: true }));
            setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
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
        if (idx && !isNaN(idx)) {
            const query = `
                query getTitle($idx: Int!) {
                    getTitle(idx: $idx) {
                        status
                        data {
                            idx
                            title
                            brief_history {
                                when
                                content
                            }
                        }
                        token
                        errors {
                            code
                            var
                            text
                        }
                    }
                }`;
            const SESSION: DocumentNode = gql`
                ${query}
            `;
            const innerQuery = SESSION.definitions[0] as OperationDefinitionNode;
            const { value } = innerQuery.name as NameNode;

            axiosApiInstance(value)
                .post(`${GQL_DOMAIN}`, {
                    query: `${query}`,
                    variables: {
                        idx: Number(idx)
                    }
                })
                .then(res => {
                    setLoading(false);
                    const { data } = res;
                    const innerData = data[value]?.data;
                    if (innerData) {
                        setTitle(innerData.title);
                        const briefHistory = innerData.brief_history as Array<IBrief>;
                        if (briefHistory.length > 0) {
                            setBrief(
                                briefHistory.map(it => {
                                    let val = '';
                                    if (it.when) {
                                        const dateTime = new Date(it.when);
                                        const month = dateTime.getMonth() + 1;
                                        val = `${dateTime.getFullYear()}-${month < 10 ? `0${month}` : month}`;
                                    }
                                    return {
                                        ...it,
                                        value: val,
                                        open: false
                                    };
                                })
                            );
                        }
                    }
                });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (result.data) {
            const {
                setTitle: { status, token, location }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickNext();
            } else if (status === 200) {
                Router.push(`/service/${location}`);
            }
        }
    }, [result.data]);

    if (loading) {
        return <Progress />;
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            <TitleContainer>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
                    <HInput width="100%" label="타이틀" variant="outlined" name="id" value={title} onChange={onChangeTitle} />
                    <div style={{ position: 'relative', width: '100%', maxWidth: `${common.size.mobileWidth}px` }}>
                        {brief.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '35%', display: 'inline-block' }}>
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
                                    width="60%"
                                    value={item.content}
                                    label={`약력 ${index + 1}`}
                                    variant="outlined"
                                    name={`brief-${index}`}
                                    marginbottom="1rem"
                                    onChange={e => onChangeBriefContent(index, e)}
                                />
                            </div>
                        ))}
                        <Fab style={{ position: 'absolute', bottom: '-10px', right: '-20px', zIndex: 1 }} color="primary" aria-label="add" onClick={onClickPlusBrief}>
                            <AddIcon />
                        </Fab>
                    </div>
                </LocalizationProvider>
                <BottomComponent state="front">
                    <HButton width="30%" onClick={onClickNext} style={{ marginTop: '30px' }}>
                        {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'}
                    </HButton>
                </BottomComponent>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </TitleContainer>
        </AbstractComponent>
    );
};

export default Title;
