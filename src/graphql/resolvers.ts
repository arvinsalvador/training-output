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
  }
};

export default resolvers;