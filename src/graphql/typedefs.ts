import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  type Account {
    id: ID
    balance: Float
    availableBalance: Float
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

  type Query {
    getAccount(id: ID!): Account
  }

  type Mutation {
    createAccount(input: CreateAccountInput): Account
    updateBalance(input: UpdateBalanceInput): Float!
  }
`;

export default typeDefs;