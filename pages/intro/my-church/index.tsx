import MyChurch from 'src/screens/intro/my-church';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyChurch;
