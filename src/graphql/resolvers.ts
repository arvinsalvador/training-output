import { Account, Balance, BalanceType } from './../classes/index';

const resolvers = {
  Query: {
    getAccount: (obj: {}, args: { id }) => {
      return Account.getAccount(args.id);
    },
    mainBalance: (obj: {}, args: { account }) => {
      return Balance.getBalance({
        account: args.account,
        type: BalanceType.TYPES.MAIN,
      });
    },
    reservedBalance: (obj: {}, args: { id }) => {
      return Balance.getBalance({
        type: BalanceType.TYPES.RESERVE,
        id: args.id,
      });
    },
    virtualBalance: (obj: {}, args: { id }) => {
      return Balance.getBalance({
        type: BalanceType.TYPES.VIRTUAL,
        id: args.id,
      });
    },
    reservedBalances: (obj: {}, args: { account }) => {
      return Balance.getBalances(args.account, BalanceType.TYPES.RESERVE);
    },
    virtualBalances: (obj: {}, args: { account }) => {
      return Balance.getBalances(args.account, BalanceType.TYPES.VIRTUAL);
    }
  },
  Mutation: {
    createAccount: async  (obj: {}, args: { input: API.Input.CreateAccountInput }) => {
      const account = new Account(args.input);
      return account.save();
    },
    createMainBalance: async (obj: {}, args: { input: API.Input.CreateMainBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      await Balance.checkBalance({
        account: account.id,
        type: BalanceType.TYPES.MAIN,
      });
      const balance = new Balance(args.input, BalanceType.TYPES.MAIN);
      return balance.save();
    },
    updateBalance: async (obj: {}, args: { input: API.Input.UpdateBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance({
        account: account.id,
        type: BalanceType.TYPES.MAIN,
      });
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    createReservedBalance: async (obj: {}, args: { input: API.Input.CreateReservedBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      await Balance.checkBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.RESERVE,
      });
      const balance = new Balance(args.input, BalanceType.TYPES.RESERVE);
      return balance.save();
    },
    updateReservedBalance: async (obj: {}, args: { input: API.Input.UpdateReservedBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.RESERVE
      });
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    releaseReservedBalance: async (obj: {}, args: { input: API.Input.ReleaseReservedBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balanceMain = await Balance.getBalance({
        account: account.id,
        type: BalanceType.TYPES.MAIN,
      });
      const balanceReserve = await Balance.getBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.RESERVE,
      });

      await Balance.update({
        account: account.id,
        type: balanceMain.type,
      }, balanceReserve.balance);

      return Balance.deleteRecord(balanceReserve.id);
    },
    createVirtualBalance: async (obj: {}, args: { input: API.Input.CreateVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      await Balance.checkBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.VIRTUAL,
      });
      const balance = new Balance(args.input, BalanceType.TYPES.VIRTUAL);
      return balance.save();
    },
    updateVirtualBalance: async (obj: {}, args: { input: API.Input.UpdateVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.VIRTUAL,
      });
      const result = await Balance.update({
        account: balance.account,
        type: balance.type,
        context: balance.context,
      }, args.input.amount);
      return result;
    },
    cancelVirtualBalance: async (obj: {}, args: { input: API.Input.CancelVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balance = await Balance.getBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.VIRTUAL,
      });

      return Balance.deleteRecord(balance.id);
    },
    commitVirtualBalance: async (obj: {}, args: { input: API.Input.CommitVirtualBalanceInput }) => {
      const account = await Account.getAccount(args.input.account);
      const balanceMain = await Balance.getBalance({
        account: account.id,
        type: BalanceType.TYPES.MAIN,
      });
      const balanceVirtual = await Balance.getBalance({
        account: account.id,
        context: args.input.context,
        type: BalanceType.TYPES.VIRTUAL,
      });

      await Balance.update({
        account: account.id,
        type: balanceMain.type,
      }, balanceVirtual.balance);

      return Balance.deleteRecord(balanceVirtual.id);
    }
  }
};

export default resolvers;