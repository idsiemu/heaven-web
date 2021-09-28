import MyIntro from 'src/screens/intro/my-intro';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyIntro;
