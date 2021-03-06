import { gql } from 'apollo-server-koa';

const typeDefs = gql`

  enum BalanceType {
    VIRTUAL
    RESERVE
    MAIN
  }

  type Account {
    id: ID
    username: String
    firstname: String
    lastname: String
    email: String
  }

  type MainBalance {
    id: ID
    account: String
    context: String
    balance: Float
    type: String
  }

  type ReservedBalance {
    id: ID
    account: String
    context: String
    balance: Float
    type: String
  }

  type VirtualBalance {
    id: ID
    account: String
    context: String
    balance: Float
    type: String
  }

  input CreateAccountInput {
    id: ID
    username: String
    firstname: String
    lastname: String
    email: String
  }

  input UpdateBalanceInput {
    request: ID!
    account: ID!
    amount: Float
  }

  input CreateMainBalanceInput {
    id: ID
    account: String!
    context: String!
    balance: Float!
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

  input ReleaseReservedBalanceInput {
    request: ID
    account: ID!
    context: String!
  }

  input CreateVirtualBalanceInput {
    id: ID
    account: String!
    context: String!
    balance: Float!
  }

  input UpdateVirtualBalanceInput {
    request: ID
    account: ID!
    context: String!
    amount: Float!
  }

  input CancelVirtualBalanceInput {
    request: ID
    account: ID!
    context: String!
  }

  input CommitVirtualBalanceInput {
    request: ID
    account: ID!
    context: String!
  }

  type Query {
    getAccount(id: ID!): Account
    mainBalance(account: ID!): MainBalance
    reservedBalance(id: ID!): ReservedBalance
    virtualBalance(id: ID!): VirtualBalance
    reservedBalances(account: ID!): [ReservedBalance]!
    virtualBalances(account: ID!): [VirtualBalance]!
  }

  type Mutation {
    createAccount(input: CreateAccountInput): Account
    createMainBalance(input: CreateMainBalanceInput): MainBalance
    updateBalance(input: UpdateBalanceInput): Float!
    createReservedBalance(input: CreateReservedBalanceInput): ReservedBalance!
    updateReservedBalance(input: UpdateReservedBalanceInput): ReservedBalance!
    releaseReservedBalance(input: ReleaseReservedBalanceInput): Boolean
    createVirtualBalance(input: CreateVirtualBalanceInput): VirtualBalance!
    updateVirtualBalance(input: UpdateVirtualBalanceInput): VirtualBalance!
    cancelVirtualBalance(input: CancelVirtualBalanceInput): Boolean
    commitVirtualBalance(input: CommitVirtualBalanceInput): Boolean
  }
`;

export default typeDefs;