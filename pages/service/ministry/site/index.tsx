import { NextPageContext } from 'next';
import Site from 'src/screens/service/ministry/site';

export const getServerSideProps = (context: NextPageContext) => {
    const { idx } = context.query;
    if (!idx) {
        if (context.res) {
            context.res.writeHead(301, {
                Location: '/'
            });
            context.res.end();
        }
    }
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

export default Site;
