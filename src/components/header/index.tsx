import { Icon, Profile, Wrapper } from "./style";
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import router from 'next/router'

const Header: React.FC = () => {
  return (
    <Wrapper>
        <Icon>
            <HomeIcon fontSize="large" onClick={() => router.push('/')}/>
        </Icon>
        <Profile>
          <Avatar src="/public/icons/default-avatar.png" onClick={() => router.push('/profile')}/>
        </Profile>
    </Wrapper>
  );
};

export default Header