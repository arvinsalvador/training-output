import { Account, Balances, BalanceType } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    }
  },
  Mutation: {
    createAccount: (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      const account = new Account('', args.input);
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
      const balances = new Balances('', args.input, BalanceType.TYPES.RESERVE);
      return balances.save();
    },
    updateReservedBalance: (obj: {}, args: { input: API.Input.UpdateReservedBalanceInput }) => {
      const balances = Balances.getBalance(args.input.account, args.input.context, BalanceType.TYPES.RESERVE);
      balances.update(args.input);
      return balances;
    },
    releaseReservedBalance: (obj: {}, args: { input: API.Input.ReleaseReservedBalanceInput }) => {
      const balances = Balances.getBalance(args.input.account, args.input.context, BalanceType.TYPES.RESERVE);
      const account = Account.getAccount(args.input.account);

      const delta = account.balance + balances.balance;
      account.balance = delta;

      return balances.delete(balances.id);
    },
  }
};

export default resolvers;