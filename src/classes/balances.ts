import * as uuid from 'uuid/v4';

import { InvalidRequestError } from './../errors';
import { balanceDatabase } from './../memorydb/index';
import { balanceModel } from './../models';

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

    if (this.balance <= 0) {
      throw new InvalidRequestError('', {
        invalidAmount: true
      });
    }
  }

  async save() {
    await balanceModel.create({
      id: this.id,
      account: this.account,
      context: this.context,
      balance: this.balance,
      type: this.type
    });
    return this;
  }

  static async getBalanceContext(context: string) {
    const balanceInfo =  await balanceModel.findOne({
      where: { context },
    });

    if (balanceInfo) {
      throw new InvalidRequestError('', {
        contextExist: true
      });
    }
    return false;
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