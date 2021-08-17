import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';

const Home = () => {
    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontSize: '1.25rem' }}>
                <p>앱으로 찾아뵙겠습니다.</p>
                <p>감사합니다.</p>
            </div>
        </AbstractComponent>
    );
};

export default Home;
