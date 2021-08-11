import AbstractComponent from "@components/abstract"
import GlobalStyle from "@styles/globalStyles"
import { LocationContainer } from "./style"
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { NextPageContext } from 'next';
import { IParam, IProps } from "@interfaces";
import { useQuery } from "@apollo/client";
import { GET_LOCATIONS } from "./gql";
import Progress from "@components/progress";
import { useEffect, useState } from 'react'
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import router from 'next/router';
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

const Location = (props:IProps) => {
    const { idx } = props.query as IParam
    const [locations, setLocations] = useState([]);
    const { loading, data, refetch } = useQuery(GET_LOCATIONS, {
        variables: {
            idx: Number(idx)
        }
    })

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
                getLocations: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setLocations(rest.data)
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
    
    
    if (loading) {
        return <Progress />
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <LocationContainer>
                <FormGroup>
                    {locations.map(lo => {
                        return <FormControlLabel
                        control={<Checkbox checked={lo.state} name={lo.idx} />}
                        label={lo.location}
                    />
                    })}
                    
                </FormGroup>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </LocationContainer>
        </AbstractComponent>
    )
}

export default Location