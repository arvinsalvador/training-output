import { Account } from './../classes/index';
import * as uuid from 'uuid/v4';

const resolvers = {
  Mutation: {
    createAccount: (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      let id = uuid();
      const account = new Account(id, args.input);
      return account.save();
    }
  }
};

export default resolvers;