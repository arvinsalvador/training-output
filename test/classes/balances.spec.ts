import { expect } from 'chai';
import { v4 as uuid } from 'uuid';

import { Account, Balances } from './../../src/classes';
import { InvalidRequestError } from '../../src/errors';

describe('Balances class', () => {
  describe('constructor', () => {
    let instance;
    let id;
    let account;
    beforeEach(() => {
      account = new Account({ balance: 50, availableBalance: 50 });
      account.save();
      instance = new Balances({ account: account.id, context: 'anyContext', balance: 100 }, 'any');
      id = instance.id;
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id', id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('account', account.id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('context', 'anyContext');
    });

    it('should set balance field', () => {
      expect(instance).to.have.property('balance', 100);
    });

    it('should set type field', () => {
      expect(instance).to.have.property('type', 'any');
    });

    describe('Given account does not exist', () => {
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'anyContext', balance: 0 }, 'any');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given context is exist', () => {
      beforeEach(() => {
        new Balances({ account: account.id, context: 'existContext', balance: 100 }, 'any');
      });
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'existContext', balance: 0 }, 'any');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given balance is less than equal to 0', () => {
      it('should throw an error', () => {
        expect(() => {
          new Balances({ account: uuid(), context: 'secondContext', balance: -5 }, 'any');
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {
    // TODO: Cannot access balanceDatabase to ensure record exists
    it('should store to the `balanceDatabase`');
  });

  describe('getBalance', () => {
    describe('Given balance exist', () => {
      let instance;
      let account;
      let result;
      beforeEach(() => {
        account = new Account({ balance: 50, availableBalance: 0 });
        account.save();
        instance = new Balances({ account: account.id, context: 'a', balance: 20 }, 'Reserve');
        result = instance.save();
      });

      it('should give the balance', () => {
        expect(Balances.getBalance(account.id, 'a', 'Reserve'))
          .to.deep.equals(result);
      });

      //TODO: does it need to expect the return value
      //of the instance since it returned value?
      it('should have a return value of the instance');
    });

    describe('Given balance does not exist', () => {
      it('should throw an error');
    });
  });

  describe('getBalanceInfo', () => {
    describe('Given balance exist', () => {
      let instance;
      let account;
      let result;
      let id;
      beforeEach(() => {
        account = new Account({ balance: 50, availableBalance: 0 });
        account.save();
        instance = new Balances({ account: account.id, context: 'b', balance: 20 }, 'Reserve');
        result = instance.save();
        id = result.id;
      });

      it('should give the balance info', () => {
        expect(Balances.getBalanceInfo(id, 'Reserve'))
          .to.deep.equals(result);
      });

      //TODO: does it need to expect the return value
      //of the instance since it returned value?
      it('should have a return value of the instance');
    });

    describe('Given balance info does not exist', () => {
      it('should return null');
    });
  });

  describe('getBalances', () => {
    describe('Given balance exist', () => {
      let instance;
      let account;
      let id;
      beforeEach(() => {
        account = new Account({ balance: 50, availableBalance: 0 });
        account.save();
        id = account.id;
        instance = new Balances({ account: id, context: 'c', balance: 20 }, 'Reserve');
        instance.save();
      });

      it('should give the balances info', () => {
        expect(Balances.getBalances(id, 'Reserve')).to.be.an('array');
      });

      //TODO: does it need to expect the return value of instance?
      it('should have a return value of the instance');
    });

    describe('Given balances does not exist', () => {
      it('should return null');
    });
  });

  describe('update', () => {
    let instance;
    let account;
    let result;
    let balanceInfo;
    beforeEach(() => {
      account = new Account({ balance: 50, availableBalance: 0 });
      account.save();
      instance = new Balances({ account: account.id, context: 'd', balance: 20 }, 'Reserve');
      result = instance.save();
      result.update(50);
      balanceInfo = Balances.getBalance(account.id, 'd', 'Reserve');
    });

    it('should return value of instance', () => {
      expect(result).to.deep.equals(balanceInfo);
    });
  });

  //TODO: Cannot access balanceDatabase to ensure record is deleted
  describe('deleteRecord', () => {
    it('should delete record from `balanceDatabase`');
  });
});