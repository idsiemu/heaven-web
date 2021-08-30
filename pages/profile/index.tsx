import Profile from 'src/screens/profile';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default Profile;
