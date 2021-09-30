import MyPosition from 'src/screens/intro/my-position';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyPosition;
