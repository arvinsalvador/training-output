import * as Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';
import * as uuid from 'uuid/v4';

const typeDefs = gql`
  type Account {
    id: ID
    balance: Float
    availableBalance: Float
  }

  type ReservedBalance {
    id: ID
    context: String
    balance: Float
  }

  type Query {
    account(id: ID!): Account
    reservedBalance(context: String!): ReservedBalance
  }

  input AccountInput {
    id: ID
    balance: Float!
    availableBalance: Float!
  }

  input UpdateBalanceInput {
    request: ID!
    account: ID!
    amount: Float
  }

  input ReservedBalanceInput {
    id: ID!
    context: String
    balance: Float!
  }

  type Mutation {
    createAccount(input: AccountInput): Account
    updateBalance(input: UpdateBalanceInput): Float!
    createReservedBalance(input: ReservedBalanceInput): ReservedBalance!
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

class ReservedBalance {
  id: string
  context: string
  balance: number
  constructor(context, data: any){
    this.id = data.id;
    this.context = context;
    this.balance = data.balance;
  }
}

const accountDatabase: { [id: string]: Account } = {};
const reservedBalanceDatabase: { [context: string]: ReservedBalance } = {};

interface AccountBalanceInput {
  id: string
  balance: number
  availableBalance: number
}

interface UpdateAccountBalanceInput {
  request: string
  account: string
  amount: number
}

interface CreateReservedBalanceInput {
  id: string
  context: string
  balance: number
}

const resolvers = {
  Query: {
    account: (obj: {}, args: {id}) => {
      return accountDatabase[args.id];
    },
    reservedBalance: (obj: {}, args: { context }) => {
      return reservedBalanceDatabase[args.context];
    }
  },
  Mutation: {
    createAccount: (obj: {}, args: { input: AccountBalanceInput }) => {
      let id = uuid();
      accountDatabase[id] = new Account(id, args.input);
      return accountDatabase[id];
    },
    updateBalance: (obj: {}, args: { input: UpdateAccountBalanceInput }) => {
      const account = accountDatabase[args.input.account];

      if(!account){
        throw new Error ('User not found!');
      }

      const delta = account.balance + args.input.amount;
      
      if(delta < 0){
        throw new Error ('Insufficient Funds');
      }

      account.balance = delta;
      return delta;
    },
    createReservedBalance: (obj: {}, args: { input: CreateReservedBalanceInput }) => {
      const account = accountDatabase[args.input.id];

      if(!account){
        throw new Error ('User not found!');
      }

      if(args.input.balance > account.balance){
        throw new Error ('Insufficient Funds');
      }

      const newAccountBalance = account.balance - args.input.balance;
      account.balance = newAccountBalance;

      let context = uuid();
      reservedBalanceDatabase[context] = new ReservedBalance(context, args.input);
      return reservedBalanceDatabase[context];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
