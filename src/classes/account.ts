import * as uuid from 'uuid/v4';

import { InvalidRequestError, InsufficientFundError } from './../errors';
import { accountDatabase } from './../memorydb/index';

export default class Account {

  id: string;
  balance: number;
  availableBalance: number;

  constructor(id = '', data: { balance, availableBalance }) {
    this.id = id;
    this.balance = data.balance;
    this.availableBalance = data.availableBalance;

    if (this.balance < 0) {
      throw new InvalidRequestError('', {
        invalidAmount: true
      });
    }
  }

  save() {
    this.id = uuid();
    accountDatabase[this.id] = new Account(this.id, {
      balance: this.balance,
      availableBalance: this.availableBalance
    });
    return Account.getAccount(this.id);
  }

  static getAccount(id: string) {

    const account = accountDatabase[id];

    if (!account) {
      throw new InvalidRequestError('', {
        accountExist: false
      });
    }
    return account;
  }

  update(input: { account, amount }) {

    const delta = this.balance + input.amount;

    if (delta < 0) {
      throw new InsufficientFundError({
        account: input.account,
        insufficientFund: true,
      });
    }

    this.balance = delta;
    return delta;
  }
}