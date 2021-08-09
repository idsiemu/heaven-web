// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { setContext } from '@apollo/client/link/context';
import { REFRESH_TOKEN, TOKEN, GQL_DOMAIN } from "src/assets/utils/ENV";
import { getCookieValue } from "src/utils/cookie";
import { createUploadLink } from 'apollo-upload-client';

// const httpLink = createUploadLink({
//     uri: 'http://localhost:4000/heaven',
// });


// const authLink = setContext((_, { headers }) => {
//     return {
//         headers: {
//         ...headers,
//         heaven_token: getCookieValue(TOKEN),
//         refresh_token: getCookieValue(REFRESH_TOKEN)
//         }
//     }
// });
  
// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache()
// });

// export default client;

import { ApolloClient, ApolloLink, InMemoryCache, concat } from '@apollo/client';

const httpLink = new createUploadLink({ uri: GQL_DOMAIN });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
    headers: {
        ...headers,
        heaven_token: getCookieValue(TOKEN),
        refresh_token: getCookieValue(REFRESH_TOKEN)
    }
}));

  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export default client;