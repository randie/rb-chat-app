import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';
import { getAccessToken } from '../auth';

const endpointUrl = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token) {
    operation.setContext({
      headers: { authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

const httpLink = new HttpLink({ uri: endpointUrl });

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: 'no-cache' } },
});

export default client;
