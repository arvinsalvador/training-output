import { Account } from './../classes/index';
import * as uuid from 'uuid/v4';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    }
  },
  Mutation: {
    createAccount: (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      let id = uuid();
      const account = new Account(id, args.input);
      return account.save();
    }
  }
};

export default resolvers;