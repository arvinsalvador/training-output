import * as Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { resolvers, typeDefs } from './graphql/index';
import { accountModel, balanceModel } from './models';

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

async function main() {
  await Promise.all([accountModel.sync(), balanceModel.sync()]);
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
  );
}

main();