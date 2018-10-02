import { InvalidRequestError } from './../errors';
import { accountDatabase } from './../memorydb/index';
import InsufficientFundErrror from '../errors/insufficient-fund-error';

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

  static updateBalance(request: string, account: string, amount: number) {

    if (!request) {
      //Throw error if request is empty.
      //Not enough knowledge what request parameter will do.
      throw new InvalidRequestError('', {
        invalidRequest: true
      });
    }

    const accountInfo = accountDatabase[account];

    if (!accountInfo) {
      throw new InvalidRequestError('', {
        accountExist: false
      });
    }

    const delta = accountInfo.balance + amount;

    if (delta < 0) {
      throw new InsufficientFundErrror({account});
    }

    accountInfo.balance = delta;
    return delta;
  }
}