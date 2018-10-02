import { InvalidRequestError, InsufficientFundError } from './../errors';
import { accountDatabase, balanceDatabase } from './../memorydb/index';
import { BalanceType } from './index';

export default class Balances {

  id: string;
  account: string;
  context: string;
  balance: number;
  type: string;

  constructor(id, data: { account, context, balance }, type) {
    this.id = id;
    this.account = data.account;
    this.context = data.context;
    this.balance = data.balance;
    this.type = type;

    const accountInfo = accountDatabase[this.account];
    const [balanceInfo] = Object.keys(balanceDatabase)
      .map(key => balanceDatabase[key])
      .filter(balances => balances.context === this.context);

    if (!accountInfo) {
      throw new InvalidRequestError('', {
        accountExist: false
      });
    }

    if (balanceInfo) {
      throw new InvalidRequestError('', {
        contextExist: true
      });
    }

    if (this.balance <= 0) {
      throw new InvalidRequestError('', {
        invalidAmount: true
      });
    }
  }

  save() {
    const accountInfo = accountDatabase[this.account];
    let balanceType = BalanceType.TYPES.VIRTUAL;

    if (this.type === BalanceType.TYPES.RESERVE) {

      balanceType = BalanceType.TYPES.RESERVE;

      if (this.balance > accountInfo.balance) {
        throw new InsufficientFundError({accountInfo});
      }

      const newAccountBalance = accountInfo.balance - this.balance;
      accountInfo.balance = newAccountBalance;

    }

    balanceDatabase[this.id] = new Balances(this.id, {
      account: this.account,
      context: this.context,
      balance: this.balance
    }, balanceType);

    return balanceDatabase[this.id];
  }

  static update(type: string, input: { request, account, context, amount }) {
    const [balanceInfo] = Object.keys(balanceDatabase)
      .map(key => balanceDatabase[key])
      .filter(balances => balances.account === input.account
        && balances.context === input.context && balances.type === type);

    if (!balanceInfo) {
      throw new InvalidRequestError('', {
        balanceExist: false
      });
    }

    const delta = balanceInfo.balance + input.amount;
    balanceInfo.balance = delta;

    return balanceInfo;
  }
}