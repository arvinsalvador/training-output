import { InvalidRequestError } from './../errors';
import { accountDatabase } from './../memorydb/index';

export default class Account {

  id: string;
  balance: number;
  availableBalance: number;

  constructor(id, data: { balance, availableBalance }) {
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
    accountDatabase[this.id] = new Account(this.id, {
      balance: this.balance,
      availableBalance: this.availableBalance
    });
    return accountDatabase[this.id];
  }

  static getAccount(id: string) {
    return accountDatabase[id] || null;
  }
}