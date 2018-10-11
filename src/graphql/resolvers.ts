import { Account, Balance, BalanceType } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    },
    reservedBalance: (obj: {}, args: { id }) => {
      return Balance.getBalance(undefined, undefined, BalanceType.TYPES.RESERVE, args.id);
    },
    virtualBalance: (obj: {}, args: { id }) => {
      return Balance.getBalance(undefined, undefined, BalanceType.TYPES.VIRTUAL, args.id);
    },
    reservedBalances: (obj: {}, args: { account }) => {
      return Balance.getBalances(args.account, BalanceType.TYPES.RESERVE);
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
    updateReservedBalance: async (obj: {}, args: { input: API.Input.UpdateReservedBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance(account.id, args.input.context, BalanceType.TYPES.RESERVE);
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    releaseReservedBalance: async (obj: {}, args: { input: API.Input.ReleaseReservedBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balanceMain = await Balance.getBalance(account.id, undefined, BalanceType.TYPES.MAIN);
      const balanceReserve = await Balance.getBalance(account.id, args.input.context, BalanceType.TYPES.RESERVE);

      await Balance.update({
        account: account.id,
        type: balanceMain.type,
        context: undefined,
      }, balanceReserve.balance);

      return Balance.deleteRecord(balanceReserve.id);
    },
    createVirtualBalance: async (obj: {}, args: { input: API.Input.CreateVirtualBalanceInput }) => {
      await Account.getAccount(args.input.account);
      await Balance.checkBalance(args.input.account, args.input.context, BalanceType.TYPES.VIRTUAL);
      const balance = new Balance(args.input, BalanceType.TYPES.VIRTUAL);
      return balance.save();
    },
    updateVirtualBalance: async (obj: {}, args: { input: API.Input.UpdateVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance(account.id, args.input.context, BalanceType.TYPES.VIRTUAL);
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    cancelVirtualBalance: async (obj: {}, args: { input: API.Input.CancelVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance(account.id, args.input.context, BalanceType.TYPES.VIRTUAL);

      return Balance.deleteRecord(balance.id);
    },
    commitVirtualBalance: async (obj: {}, args: { input: API.Input.CommitVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balanceMain = await Balance.getBalance(account.id, undefined, BalanceType.TYPES.MAIN);
      const balanceVirtual = await Balance.getBalance(account.id, args.input.context, BalanceType.TYPES.VIRTUAL);

      await Balance.update({
        account: account.id,
        type: balanceMain.type,
        context: undefined,
      }, balanceVirtual.balance);

      return Balance.deleteRecord(balanceVirtual.id);
    }
  }
};

export default resolvers;