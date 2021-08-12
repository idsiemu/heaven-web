import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import { HBottomNavigation, HomeContainer } from './style';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from 'react';

const Home = () => {
    const [nav, setNav] = useState('home');

    const onChangeNav = (event: React.ChangeEvent<{}>, newValue: string) => {
        setNav(newValue);
    };

    return (
        <AbstractComponent>
            <GlobalStyle />
            <HomeContainer>
                <div>준중입니다</div>
                <HBottomNavigation value={nav} onChange={onChangeNav}>
                    <BottomNavigationAction label="홈" value="home" icon={<HomeIcon />} />
                    <BottomNavigationAction label="검색" value="search" icon={<SearchIcon />} />
                    <BottomNavigationAction label="채팅" value="chat" icon={<ForumIcon />} />
                    <BottomNavigationAction label="프로필" value="profile" icon={<AccountCircleIcon />} />
                </HBottomNavigation>
            </HomeContainer>
        </AbstractComponent>
    );
};

export default Home;
