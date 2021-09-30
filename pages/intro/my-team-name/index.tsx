import MyTeamName from 'src/screens/intro/my-team-name';

export const getServerSideProps = context => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default MyTeamName;
