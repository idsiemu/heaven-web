import { BackBtn, Icon, Profile, Wrapper } from './style';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import generateAvatar from 'src/utils/avatar';
import { Fragment } from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { IHeader } from './type';

const Header: React.FC<IHeader> = props => {
    const { session } = useSelector((state: RootState) => state.sessionReducer);

    const onClickBack = () => {
        if (props.history.length === 1 && props.back_url) {
            router.push(props.back_url);
        } else {
            if (props.back_url) {
                if (props.back_url.indexOf('/intro') === -1) {
                    router.back();
                } else {
                    if (props.history.includes(props.back_url)) {
                        router.back();
                    } else {
                        router.push(props.back_url);
                    }
                }
            } else {
                router.back();
            }
        }
    };
    return (
        <Wrapper>
            <BackBtn>{(props.history.length > 1 || props.back_url) && <ArrowBack fontSize="large" onClick={onClickBack} />}</BackBtn>
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
