import { gql } from 'apollo-server-koa';

const typeDefs = gql`

  enum BalanceType {
    VIRTUAL
    RESERVE
  }

  type Account {
    id: ID
    balance: Float
    availableBalance: Float
  }

  type ReservedBalance {
    id: ID
    account: String
    context: String
    balance: Float
    type: String
  }

  input CreateAccountInput {
    id: ID
    balance: Float!
    availableBalance: Float!
  }

  input UpdateBalanceInput {
    request: ID!
    account: ID!
    amount: Float
  }

  input CreateReservedBalanceInput {
    id: ID
    account: String!
    context: String!
    balance: Float!
  }

  input UpdateReservedBalanceInput {
    request: ID
    account: ID!
    context: String!
    amount: Float!
  }

  type Query {
    getAccount(id: ID!): Account
  }

  type Mutation {
    createAccount(input: CreateAccountInput): Account
    updateBalance(input: UpdateBalanceInput): Float!
    createReservedBalance(input: CreateReservedBalanceInput): ReservedBalance!
    updateReservedBalance(input: UpdateReservedBalanceInput): ReservedBalance!
  }
`;

export default typeDefs;