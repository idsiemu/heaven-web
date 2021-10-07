import { NextPageContext } from 'next';
import Age from '@screens/service/ministry/age';

export const getServerSideProps = (context: NextPageContext) => {
    const { role, idx } = context.query;
    if (!idx && !role) {
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

export default Age;
