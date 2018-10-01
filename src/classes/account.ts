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
  }

  createAccount() {

    if (this.balance < 0) {
      throw new InvalidRequestError('', {
        invalidAmount: true
      });
    }

    const argInputs = { balance: this.balance, availableBalance: this.availableBalance };

    accountDatabase[this.id] = new Account(this.id, argInputs);
    return accountDatabase[this.id];
  }
}