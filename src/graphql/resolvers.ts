import { Account, Balances, BalanceType } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    },
    reservedBalance: (obj: {}, args: { id }) => {
      return Balances.getBalanceInfo(args.id, BalanceType.TYPES.RESERVE);
    },
    virtualBalance: (obj: {}, args: {id}) => {
      return Balances.getBalanceInfo(args.id, BalanceType.TYPES.VIRTUAL);
    },
    reservedBalances: (obj: {}, args: {account}) => {
      return Balances.getBalances(args.account, BalanceType.TYPES.RESERVE);
    },
    virtualBalances: (obj: {}, args: {account}) => {
      return Balances.getBalances(args.account, BalanceType.TYPES.VIRTUAL);
    }
  },
  Mutation: {
    createAccount: (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      const account = new Account(args.input);
      return account.save();
    },
    updateBalance: (obj: {}, args: { input: API.Input.UpdateBalanceInput }) => {
      const account = Account.getAccount(args.input.account);
      return account.update(args.input);
    },
    createReservedBalance: (obj: {}, args: { input: API.Input.CreateVirtualBalanceInput }) => {
      const balances = new Balances(args.input, BalanceType.TYPES.RESERVE);
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
    createVirtualBalance: (obj: {}, args: { input: API.Input.CreateVirtualBalanceInput }) => {
      const balances = new Balances(args.input, BalanceType.TYPES.VIRTUAL);
      return balances.save();
    },
    updateVirtualBalance: (obj: {}, args: { input: API.Input.UpdateVirtualBalanceInput }) => {
      const balances = Balances.getBalance(args.input.account, args.input.context, BalanceType.TYPES.VIRTUAL);
      balances.update(args.input);
      return balances;
    },
    cancelVirtualBalance: (obj: {}, args: { input: API.Input.CancelVirtualBalanceInput }) => {
      const balances = Balances.getBalance(args.input.account, args.input.context, BalanceType.TYPES.VIRTUAL);

      return balances.delete(balances.id);
    },
    commitVirtualBalance: (obj: {}, args: { input: API.Input.CommitVirtualBalanceInput }) => {
      const balances = Balances.getBalance(args.input.account, args.input.context, BalanceType.TYPES.VIRTUAL);
      const account = Account.getAccount(args.input.account);

      const delta = account.balance + balances.balance;
      account.balance = delta;

      return balances.delete(balances.id);
    }
  }
};

export default resolvers;