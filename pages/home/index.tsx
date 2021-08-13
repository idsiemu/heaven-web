import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Header from '@components/header';
import { Body } from '@components/body/style';

const Home = () => {
    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header />
            <Body>
                <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', flexDirection: 'column', fontSize:'1.25rem'}}><p>앱으로 찾아뵙겠습니다.</p><p>감사합니다.</p></div>
            </Body>
        </AbstractComponent>
    );
};

export default Home;
