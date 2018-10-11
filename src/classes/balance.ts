import * as uuid from 'uuid/v4';
import { isUndefined } from 'util';

import { InvalidRequestError } from '../errors';
import { balanceModel } from '../models';
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

    if (this.type === BalanceType.TYPES.RESERVE) {
      await Balance.update({ account: this.account, type: BalanceType.TYPES.MAIN }, -this.balance);
    }

    await balanceModel.create({
      id: this.id,
      account: this.account,
      context: (this.type === BalanceType.TYPES.MAIN ? this.type : this.context),
      balance: this.balance,
      type: this.type
    });
    return this;
  }

  static async getBalance(account? : string, context? : string,  type? : string, id? : string) {
    let whereObj: { [id : string] : any} = {};

    if (!isUndefined(account)) whereObj['account'] = account;
    if (!isUndefined(context)) whereObj['context'] = context;
    if (!isUndefined(type)) whereObj ['type'] = type;
    if (!isUndefined(id)) whereObj ['id'] = id;

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
    if (!isUndefined(type)) whereObj ['type'] = type;

    if (!isUndefined(context)) {
      if (!context) {
        throw new InvalidRequestError('', {
          contextRequired: true
        });
      }
      whereObj['context'] = context;
    }
    const balanceInfo =  await balanceModel.findOne({
      where: whereObj,
    });

    if (balanceInfo) {
      throw new InvalidRequestError('', {
        contextExist: true
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

  static async update(args: { account, type, context? }, amount) {
    let whereObj: { [id : string] : any} = {
      account: args.account,
      type: args.type
    };

    if (!isUndefined(args.context)) whereObj['context'] = args.context;

    let delta;

    const instance = await balanceModel.findOne({
      where : whereObj
    });

    if (instance) {
      delta = instance.balance + amount;
      instance.update(
        { balance: delta },
        { where: { id: instance.id }}
      );
    }

    if (args.type === BalanceType.TYPES.MAIN) {
      return delta;
    }

    return instance;
  }

  static async deleteRecord(id: string) {

    await balanceModel.destroy({
        where: { id: id }
    });

    return true;
  }
}