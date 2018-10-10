import { Account } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    },

  },
  Mutation: {
    createAccount: (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      const account = new Account(args.input);
      return account.save();
    },
  }
};

export default resolvers;