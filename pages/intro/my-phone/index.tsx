import MyPhone from 'src/screens/intro/my-phone';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyPhone;
