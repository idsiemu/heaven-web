import { NextPageContext } from 'next';
import Title from 'src/screens/service/praise/title';

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

export default Title;
