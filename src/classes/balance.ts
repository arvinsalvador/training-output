import * as uuid from 'uuid/v4';
import { isUndefined } from 'util';

import { InvalidRequestError } from './../errors';
import { balanceDatabase } from './../memorydb/index';
import { balanceModel } from './../models';
import { BalanceType } from './index';

export default class Balance {

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
      context: (this.type === BalanceType.TYPES.MAIN ? this.type : this.context),
      balance: this.balance,
      type: this.type
    });
    return this;
  }

  static async getBalance(account? : string, context? : string,  type? : string) {
    let whereObj: { [id : string] : any} = {};

    if (!isUndefined(account)) whereObj['account'] = account;
    if (!isUndefined(context)) whereObj['context'] = context;
    if (!isUndefined(type)) whereObj ['type'] = type;

    const balanceInfo =  await balanceModel.findOne({
      where: whereObj,
    });

    if (!balanceInfo) {
      throw new InvalidRequestError('', {
        balanceExist: false
      });
    }

    return balanceInfo;
  }

  static async checkBalance(account? : string, context? : string,  type? : string) {
    let whereObj: { [id : string] : any} = {};

    if (!isUndefined(account)) whereObj['account'] = account;
    if (!isUndefined(context)) whereObj['context'] = context;
    if (!isUndefined(type)) whereObj ['type'] = type;

    const balanceInfo =  await balanceModel.findOne({
      where: whereObj,
    });

    if (balanceInfo) {
      throw new InvalidRequestError('', {
        balanceExist: true
      });
    }

    return false;
  }

  static async getBalances(account, type) {
    const balanceInfo =  await balanceModel.findOne({
      where: { account, type },
    });

    if (!balanceInfo) {
      throw new InvalidRequestError('', {
        balanceExist: false
      });
    }

    return balanceInfo;
  }

  static async update(account : string, type : string, amount : number, context? : string) {
    let whereObj: { [id : string] : any} = {
      account: account,
      type: type
    };

    if (!isUndefined(context)) whereObj['context'] = context;

    const instance = await balanceModel.findOne({
      attributes: ['account', 'balance'],
      where : whereObj
    });

    if (instance) {
      console.log(instance.balance);
    }
  }

  static deleteRecord(id: string) {
    delete balanceDatabase[id];
    return true;
  }
}