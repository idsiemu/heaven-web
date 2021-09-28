import MyRole from 'src/screens/intro/my-role';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyRole;
