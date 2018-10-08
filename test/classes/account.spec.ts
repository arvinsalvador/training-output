import { expect } from 'chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { Account } from './../../src/classes';
import { InvalidRequestError, InsufficientFundError } from '../../src/errors';

describe('Account Class', () => {
  let accountDatabaseMock = {};
  const getAccountFake = sinon.fake((id: string) => accountDatabaseMock[id]);
  let AccountMock = (proxyquire('./../../src/classes/account.ts', {
    './../memorydb/index': {
      accountDatabase: accountDatabaseMock
    }
  })).default;

  describe('constructor', () => {
    let instance;
    let id;
    beforeEach(() => {
      getAccountFake.resetHistory();
      instance = new AccountMock({ balance: 10, availableBalance: 100 });
      id = instance.id;
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id').to.equals(id);
    });

    it('should set balance field', () => {
      expect(instance).to.have.property('balance').to.equals(10);
    });

    it('should set availableBalance field', () => {
      expect(instance).to.have.property('availableBalance').to.equals(100);
    });

    describe('Given balance is less than 0', () => {
      it('should throw an error', () => {
        expect(() => {
          getAccountFake.resetHistory();
          new AccountMock({ balance: -1, availableBalance: 0 });
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {
    describe('Given account does not exist', () => {
      let instance;
      beforeEach(() => {
        getAccountFake.resetHistory();
        instance = new AccountMock({ balance: 10, availableBalance: 100 });
        instance.save();
      });
      it('should store to the `accountDatabase`', () => {
        expect(accountDatabaseMock[instance.id]).to.have.property('id').to.equals(instance.id);
      });
    });
  });

  describe('getAccount', () => {
    describe('Given account exist', () => {
      let id;
      let instance;
      let result;
      beforeEach(() => {
        getAccountFake.resetHistory();
        instance = new AccountMock({ balance: 100, availableBalance: 100 });
        id = instance.id;
        result = instance.save();
      });

      it('should give the account', () => {
        expect(AccountMock.getAccount(id)).to.deep.equals(instance);
      });

      it('should have a return value of the instance', () => {
        expect(instance).to.deep.equals(result);
      });
    });
  });

  describe('update', () => {
    let instance;
    beforeEach(() => {
      instance = new Account({ balance: 0, availableBalance: 0 });

    });

    describe('Given delta is less than 0', () => {
      it('should throw an error', () => {
        expect(() => {
          instance.update(-1);
        }).to.throw(InsufficientFundError);
      });
    });

    describe('Given delta is greater than 0', () => {
      it('should update the balance', () => {
        instance.update(10);
        expect(instance.balance).to.equal(10);
      });

      it('should return value of the delta', () => {
        expect(instance.update(50)).to.equal(50);
      });
    });
  });
});