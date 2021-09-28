import { BackBtn, Icon, Profile, Wrapper } from './style';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import generateAvatar from 'src/utils/avatar';
import { Fragment } from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
const Header: React.FC = () => {
    const { session } = useSelector((state: RootState) => state.sessionReducer);

    return (
        <Wrapper>
            <BackBtn>
                <ArrowBack fontSize="large" onClick={() => router.back()} />
            </BackBtn>
            {router.pathname.indexOf('/intro') === -1 && (
                <Fragment>
                    <Icon>
                        <HomeIcon fontSize="large" onClick={() => router.push('/')} />
                    </Icon>
                    <Profile>
                        <Avatar src={generateAvatar(session)} onClick={() => router.push('/profile')} />
                    </Profile>
                </Fragment>
            )}
        </Wrapper>
    );
};

export default Header;
