import * as uuid from 'uuid/v4';

import { InvalidRequestError, InsufficientFundError } from './../errors';
import { accountDatabase, balanceDatabase } from './../memorydb/index';
import { BalanceType } from './index';

export default class Balances {

  id: string;
  account: string;
  context: string;
  balance: number;
  type: string;

  constructor(data: { account, context, balance }, type) {
    this.id = uuid();
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

    if (this.type === BalanceType.TYPES.RESERVE) {

      if (this.balance > accountInfo.balance) {
        throw new InsufficientFundError({accountInfo});
      }

      const newAccountBalance = accountInfo.balance - this.balance;
      accountInfo.balance = newAccountBalance;
    }

    balanceDatabase[this.id] = this;
    return this;
  }

  static getBalance(account, context, type) {
    const [balanceInfo] = Object.keys(balanceDatabase)
      .map(key => balanceDatabase[key])
      .filter(balances => balances.account === account
        && balances.context === context && balances.type === type);

    if (!balanceInfo) {
      throw new InvalidRequestError('', {
        balanceExist: false
      });
    }

    return balanceInfo;
  }

  static getBalanceInfo(id, type) {
    const [balance] = Object.keys(balanceDatabase)
      .map(key => balanceDatabase[key])
      .filter(balances => balances.id === id && balances.type === type);

    return balance || null;
  }

  static getBalances(account, type) {
    const balance = Object.keys(balanceDatabase)
      .map(key => balanceDatabase[key])
      .filter(balances => balances.account === account && balances.type === type);

    return balance || null;
  }

  update(input: { amount }) {
    const delta = this.balance + input.amount;
    this.balance = delta;
    return this;
  }

  static deleteRecord(id: string) {
    delete balanceDatabase[id];
    return true;
  }
}