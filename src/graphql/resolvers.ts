import { Account, Balance, BalanceType } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    },

  },
  Mutation: {
    createAccount: async  (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      const account = new Account(args.input);
      return account.save();
    },
    createMainBalance: async (obj: {}, args: { input: API.Input.CreateMainBalanceInput }) => {
      await Account.getAccount(args.input.account);
      await Balance.checkBalance(args.input.account, undefined, BalanceType.TYPES.MAIN);
      const balances = new Balance(args.input, BalanceType.TYPES.MAIN);
      return balances.save();
    },
    updateBalance: async (obj: {}, args: { input: API.Input.UpdateBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance(account.id, undefined, BalanceType.TYPES.MAIN);
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    createReservedBalance: async (obj: {}, args: { input: API.Input.CreateReservedBalanceInput }) => {
      await Account.getAccount(args.input.account);
      await Balance.checkBalance(args.input.account, args.input.context, BalanceType.TYPES.RESERVE);
      const balances = new Balance(args.input, BalanceType.TYPES.RESERVE);
      return balances.save();
    },
  }
};

export default resolvers;