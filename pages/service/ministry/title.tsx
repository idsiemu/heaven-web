import { Fragment, useState } from 'react';
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
import { DocumentNode, gql } from '@apollo/client';
// import gqlQueryInstance from '@apollo/gqlQueryInstance';
import { useCookie } from 'next-cookie';

const TitleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

export const GET_TITLE: DocumentNode = gql`
    query getTitle($idx: Int!) {
        getTitle(idx: $idx) {
            status
        }
    }
`;

interface IBrief {
    open: boolean;
    value: string;
    when: Date | null;
    content: string;
}

const Title: React.FC = () => {
    const cookie = useCookie();
    // const response = gqlQueryInstance(GET_TITLE, cookie, {
    //     variables: { idx: 1 }
    // });
    // console.log(response);
    const [brief, setBrief] = useState<Array<IBrief>>([
        {
            open: false,
            value: '',
            when: new Date(),
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
            when: new Date(),
            content: ''
        });
        setBrief(() => [...brief]);
    };

    const onClickNext = () => {
        console.log(1234);
    };
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
                        다음
                    </HButton>
                </div>
            </TitleContainer>
        </AbstractComponent>
    );
};

export default Title;
