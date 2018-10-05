import { expect } from 'chai';
import { v4 as uuid } from 'uuid';

import { Account, Balances } from './../../src/classes';
import { InvalidRequestError } from '../../src/errors';

describe('Balances class', () => {
  let account;

  beforeEach(() => {
    account = new Account({ balance: 100, availableBalance: 50 });
    account.save();
  });

  describe('constructor', () => {
    let instance;
    let id;
    beforeEach(() => {
      instance = new Balances({ account: account.id, context: 'a', balance: 100 }, 'Reserve');
      id = instance.id;
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id', id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('account', account.id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('context', 'a');
    });

    it('should set balance field', () => {
      expect(instance).to.have.property('balance', 100);
    });

    it('should set type field', () => {
      expect(instance).to.have.property('type', 'Reserve');
    });

    describe('Given account does not exist', () => {
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'a', balance: 0 }, 'Reserve');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given context is exist', () => {
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'a', balance: 0 }, 'Reserve');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given balance is less than equal to 0', () => {
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'b', balance: -5 }, 'any');
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {
    // TODO: Cannot access balanceDatabase to ensure record exists
    it('should store to the `balanceDatabase`');
  });

  describe('getBalance', () => {
    describe('Given balance does not exist', () => {
      expect(() => {
        Balances.getBalance(uuid(), 'abcd', 'any');
      }).to.throw(InvalidRequestError);
    });

    describe('Given balance exist', () => {
      let instance;
      let result;
      beforeEach(() => {
        instance = new Balances({account: account.id, context: 'c', balance: 50 }, 'Reserve');
        instance.save();
        result = Balances.getBalance(account.id, 'c', 'Reserve');
      });

      it('should give the balance', () => {
        expect(result).to.deep.equals(instance);
      });

      //TODO: Need clarrifications in this it()
      it('should return a value of the instance');
    });
  });

  describe('getBalanceInfo', () => {
    describe('Given balance exist', () => {
      let instance;
      let result;
      beforeEach(() => {
        instance = new Balances({account: account.id, context: 'd', balance: 50 }, 'Reserve');
        instance.save();
        result = Balances.getBalance(account.id, 'd', 'Reserve');
      });

      it('should give the balance info', () => {
        expect(result).to.deep.equals(instance);
      });

      //TODO: Need clarrifications in this it()
      it('should return a value of the instance');
    });

    describe('Given balance does not exist', () => {
      it('should return null');
    });
  });

  describe('getBalances', () => {
    describe('Given balance exist', () => {
      let result;
      beforeEach(() => {
        result = Balances.getBalances(account.id, 'Reserve');
      });

      it('should give balances info', () => {
        expect(result).to.be.an('array');
      });

      //TODO: Need clarrifications in this it()
      it('should return a value of the instance');
    });

    describe('Given balance does not exist', () => {
      it('should return null');
    });
  });

  describe('update', () => {
    let instance;
    let result;
    let balanceInfo;
    beforeEach(() => {
      instance = new Balances({ account: account.id, context: 'e', balance: 20 }, 'Reserve');
      result = instance.save();
      result.update(20);
      balanceInfo = Balances.getBalance(account.id, 'e', 'Reserve');
    });

    it('should return value of instance', () => {
      expect(result).to.deep.equals(balanceInfo);
    });
  });

  describe('deleteRecord', () => {
    //TODO: Cannot access balanceDatabase to check if record is deleted
    it('should delete record from `balanceDatabase`');
  });
});