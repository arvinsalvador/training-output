import { Account, Balances, BalanceType } from './../classes/index';
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
    },
    updateBalance: (obj: {}, args: { input: API.Input.UpdateBalanceInput }) => {
      return Account.updateBalance(
        args.input.request,
        args.input.account,
        args.input.amount
      );
    },
    createReservedBalance: (obj: {}, args: { input: API.Input.CreateVirtualBalanceInput }) => {
      let id = uuid();
      const balances = new Balances(id, args.input, BalanceType.TYPES.RESERVE);
      return balances.save();
    },
  }
};

export default resolvers;