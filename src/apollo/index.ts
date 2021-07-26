import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { useCookie } from "next-cookie";

const cookie = useCookie()
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/heaven',
});


const authLink = setContext((_, { headers }) => {
    const heaven_token = cookie.get('heaven_token');
    const refresh_token = cookie.get('refresh_token');
    return {
        headers: {
        ...headers,
        heaven_token: heaven_token ? heaven_token : "",
        refresh_token: refresh_token ? refresh_token : "",
        }
    }
});
  
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;