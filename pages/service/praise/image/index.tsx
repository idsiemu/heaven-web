import { NextPageContext } from 'next';
import Image from 'src/screens/service/praise/image';

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

export default Image;
