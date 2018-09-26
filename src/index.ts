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
    accountId: String
    context: String
    balance: Float
  }

  type VirtualBalance {
    id: ID
    accountId: String
    context: String
    balance: Float
  }

  type Query {
    account(id: ID!): Account
    reservedBalance(id: ID!): ReservedBalance
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
    id: ID
    accountId: String!
    context: String!
    balance: Float!
  }

  input UpdateReservedBalanceInput {
    request: ID
    account: ID!
    context: String!
    amount: Float!
  }

  input ReleaseReservedBalanceInput {
    request: ID
    account: ID!
    context: String!
  }

  input VirtualBalanceInput {
    id: ID
    accountId: String!
    context: String!
    balance: Float!
  }

  input UpdateVirtualBalanceInput {
    request: ID
    account: ID!
    context: String!
    amount: Float!
  }

  type Mutation {
    createAccount(input: AccountInput): Account
    updateBalance(input: UpdateBalanceInput): Float!
    createReservedBalance(input: ReservedBalanceInput): ReservedBalance!
    updateReservedBalance(input: UpdateReservedBalanceInput): ReservedBalance!
    releaseReservedBalance(input: ReleaseReservedBalanceInput): Boolean
    createVirtualBalance(input: VirtualBalanceInput): VirtualBalance!
    updateVirtualBalance(input: UpdateVirtualBalanceInput): VirtualBalance!
  }
`;

class Account {
  id: string;
  balance: number;
  availableBalance: number;
  constructor(id, data: { balance, availableBalance }) {
    this.id = id;
    this.balance = data.balance;
    this.availableBalance = data.availableBalance;
  }
}

class ReservedBalance {
  id: string;
  accountId: string;
  context: string;
  balance: number;
  constructor(id, data: { accountId, context, balance }) {
    this.id = id;
    this.accountId = data.accountId;
    this.context = data.context;
    this.balance = data.balance;
  }
}

class VirtualBalance {
  id: string;
  accountId: string;
  context: string;
  balance: number;
  constructor(id, data: { accountId, context, balance }) {
    this.id = id;
    this.accountId = data.accountId;
    this.context = data.context;
    this.balance = data.balance;
  }
}

const accountDatabase: { [id: string]: Account } = {};
const reservedBalanceDatabase: { [id: string]: ReservedBalance } = {};
const virtualBalanceDatabase: { [id: string]: VirtualBalance } = {};

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
  accountId: string
  context: string
  balance: number
}

interface UpdateReservedBalanceInput {
  request: string
  account: string
  context: string
  amount: number
}

interface ReleaseReservedBalanceInput {
  request: string
  account: string
  context: string
}

interface CreateVirtualBalanceInput {
  id: string
  accountId: string
  context: string
  balance: number
}

interface UpdateVirtualBalanceInput {
  request: string
  account: string
  context: string
  amount: number
}

const resolvers = {
  Query: {
    account: (obj: {}, args: {id}) => {
      return accountDatabase[args.id];
    },
    reservedBalance: (obj: {}, args: { id }) => {
      return reservedBalanceDatabase[args.id];
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

      if (!account) {
        throw new Error ('User not found!');
      }

      const delta = account.balance + args.input.amount;

      if (delta < 0) {
        throw new Error ('Insufficient Funds');
      }

      account.balance = delta;
      return delta;
    },
    createReservedBalance: (obj: {}, args: { input: CreateReservedBalanceInput }) => {
      const account = accountDatabase[args.input.accountId];
      const [reserveBalance] = Object
        .keys(reservedBalanceDatabase)
        .map(key => reservedBalanceDatabase[key])
        .filter(reserved => reserved.context === args.input.context);

      if (!account) {
        throw new Error ('User not found!');
      }

      if (reserveBalance) {
        throw new Error ('Context already exists');
      }

      if (args.input.balance > account.balance) {
        throw new Error ('Insufficient Funds');
      }

      const newAccountBalance = account.balance - args.input.balance;
      account.balance = newAccountBalance;

      let id = uuid();
      reservedBalanceDatabase[id] = new ReservedBalance(id, args.input);
      return reservedBalanceDatabase[id];
    },
    updateReservedBalance: (obj: {}, args: { input: UpdateReservedBalanceInput }) => {
      const [reserveBalance] = Object
        .keys(reservedBalanceDatabase)
        .map(id => reservedBalanceDatabase[id])
        .filter(reserved => reserved.accountId === args.input.account && reserved.context === args.input.context);

      if (!reserveBalance) {
        throw new Error ('Reserve Balance not Found!');
      }

      const delta = reserveBalance.balance + args.input.amount;
      reserveBalance.balance = delta;

      return reserveBalance;
    },
    releaseReservedBalance: (obj: {}, args: { input: ReleaseReservedBalanceInput }) => {
      const account = accountDatabase[args.input.account];
      const [reserveBalance] = Object
        .keys(reservedBalanceDatabase)
        .map(id => reservedBalanceDatabase[id])
        .filter(reserved => reserved.accountId === args.input.account && reserved.context === args.input.context);

      if (!reserveBalance) {
        throw new Error ('Reserve Balance not Found!');
      }

      const delta = account.balance + reserveBalance.balance;
      account.balance = delta;

      delete reservedBalanceDatabase[reserveBalance.id];

      return true;
    },
    createVirtualBalance: (obj: {}, args: { input: CreateVirtualBalanceInput }) => {
      const account = accountDatabase[args.input.accountId];
      const [virtualBalance] = Object
        .keys(virtualBalanceDatabase)
        .map(key => virtualBalanceDatabase[key])
        .filter(virtual => virtual.context === args.input.context);

      if (!account) {
        throw new Error ('User not found!');
      }

      if (virtualBalance) {
        throw new Error ('Context already exists');
      }

      if (args.input.balance <= 0) {
        throw new Error ('Invalid Amount');
      }

      const id = uuid();
      virtualBalanceDatabase[id] = new VirtualBalance(id, args.input);
      return virtualBalanceDatabase[id];
    },
    updateVirtualBalance: (obj: {}, args: { input: UpdateVirtualBalanceInput }) => {
      const [virtualBalance] = Object
        .keys(virtualBalanceDatabase)
        .map(id => virtualBalanceDatabase[id])
        .filter(virtual => virtual.accountId === args.input.account && virtual.context === args.input.context);

      if (!virtualBalance) {
        throw new Error ('Virtual Balance not Found!');
      }

      if (args.input.amount <= 0) {
        throw new Error ('Invalid Amount');
      }

      const delta = virtualBalance.balance + args.input.amount;
      virtualBalance.balance = delta;

      return virtualBalance;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
