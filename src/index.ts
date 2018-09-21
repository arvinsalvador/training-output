import * as Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';
import * as uuid from 'uuid/v4';

const typeDefs = gql`
  type Account {
    id: ID
    balance: Float
    availableBalance: Float
  }

  type Query {
    account(id: ID): Account
  }

  input AccountInput {
    id: ID
    balance: Float!
    availableBalance: Float!
  }

  type Mutation {
    createAccount(input: AccountInput): Account
  }
`;

class Account {
  id = String;
  balance = Number;
  availableBalance = Number;
  constructor(id, data: any){
    this.id = id;
    this.balance = data.balance;
    this.availableBalance = data.availableBalance;
  }
}

const accountDatabase = {};

const resolvers = {
  Mutation: {
    createAccount: (obj: Object, args: {input:Object}) => {
      let id = uuid();
      accountDatabase[id] = args.input;
      console.log(args.input);
      return new Account(id, args.input);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
