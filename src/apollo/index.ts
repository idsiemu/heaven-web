import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { REFRESH_TOKEN, TOKEN } from "src/assets/utils/ENV";
import { getCookieValue } from "src/utils/cookie";

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/heaven',
});


const authLink = setContext((_, { headers }) => {
    return {
        headers: {
        ...headers,
        heaven_token: getCookieValue(TOKEN),
        refresh_token: getCookieValue(REFRESH_TOKEN)
        }
    }
});
  
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;