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

  type Mutation {
    createAccount(input: CreateAccountInput): Account
  }
`;

export default typeDefs;