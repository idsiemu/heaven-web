import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { IProps } from '@interfaces';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { RootState } from '@redux/reducers';
import { useSelector } from 'react-redux';

const Home: React.FC<IProps> = props => {
    const session = useSelector((state: RootState) => state.sessionReducer);
    const [isServer, setIsServer] = useState(false);
    const onClickService = () => {
        if (session.session) {
        }
    };
    useEffect(() => {
        if (props.query.service_popup) {
            setIsServer(true);
        }
    }, [props.query]);
    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} />
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontSize: '1.25rem' }}>
                <p>앱으로 찾아뵙겠습니다.</p>
                <p>감사합니다.</p>
            </div>
            {isServer && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        borderTop: '1px solid',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        padding: '2.5rem 0',
                        fontSize: '1.25rem'
                    }}
                    onClick={onClickService}
                >
                    사역등록 하기
                </div>
            )}
        </AbstractComponent>
    );
};

export default Home;
