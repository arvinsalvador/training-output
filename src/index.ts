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
    account(id: ID!): Account
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
  id: string;
  balance: number;
  availableBalance: number;
  constructor(id, data: any){
    this.id = id;
    this.balance = data.balance;
    this.availableBalance = data.availableBalance;
  }
}

const accountDatabase: { [id: string]: Account } = {};

interface AccountBalanceInput {
  id: string
  balance: number
  availableBalance: number
}

const resolvers = {
  Query: {
    account: (obj:{}, args: {id}) => {
      return accountDatabase[args.id];
    }
  },
  Mutation: {
    createAccount: (obj: {}, args: {input:AccountBalanceInput}) => {
      let id = uuid();
      accountDatabase[id] = new Account(id, args.input);
      return accountDatabase[id];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
