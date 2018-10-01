import * as Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { resolvers, typeDefs } from './graphql/index';

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
