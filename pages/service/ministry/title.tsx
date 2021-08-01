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

const TitleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

interface IBrief {
    when: Date | null;
    content: string;
}

const Title: React.FC = () => {
    const [value, setValue] = useState<Date | null>(null);
    const [brief, setBrief] = useState<Array<IBrief>>([
        {
            when: new Date(),
            content: ''
        }
    ]);
    const [title, setTitle] = useState('');

    const onChangeBriefWhen = (index: number, date: Date | null) => {
        brief[index].when = date;
        setBrief(() => [...brief]);
    };

    const onChangeBriefContent = (index: number, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        brief[index].content = e.target.value;
        setBrief(() => [...brief]);
    };

    const onClickPlusBrief = () => {
        brief.push({
            when: new Date(),
            content: ''
        });
        setBrief(() => [...brief]);
    };
    return (
        <AbstractComponent>
            <TitleContainer>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
                    <HInput width="100%" label="타이틀" variant="outlined" name="id" />
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
                                        renderInput={params => <TextField {...params} />}
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
            </TitleContainer>
        </AbstractComponent>
    );
};

export default Title;
