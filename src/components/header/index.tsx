import { Icon, Profile, Wrapper } from './style';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import generateAvatar from 'src/utils/avatar';

const Header: React.FC = () => {
    const { session } = useSelector((state: RootState) => state.sessionReducer);
    return (
        <Wrapper>
            <Icon>
                <HomeIcon fontSize="large" onClick={() => router.push('/')} />
            </Icon>
            <Profile>
                <Avatar src={generateAvatar(session)} onClick={() => router.push('/profile')} />
            </Profile>
        </Wrapper>
    );
};

export default Header;
