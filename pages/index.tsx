import Home from './home';
import { NextPageContext } from 'next';

export const getServerSideProps = (context: NextPageContext) => {
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};
export default Home;
