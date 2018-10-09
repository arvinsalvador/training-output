import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { InvalidRequestError } from '../../src/errors';

describe('Balances class', () => {
  let account;
  let context = uuid();

  let accountDatabaseMock = {};
  let balanceDatabaseMock = {};

  const getBalanceFake = sinon.fake((id: string) => balanceDatabaseMock[id]);

  let AccountMock = (proxyquire('./../../src/classes/account.ts', {
    './../memorydb/index': {
      accountDatabase: accountDatabaseMock
    }
  })).default;

  let BalancesMock = (proxyquire('./../../src/classes/balances.ts', {
    './../memorydb/index': {
      balanceDatabase: balanceDatabaseMock,
      accountDatabase: accountDatabaseMock
    }
  })).default;

  beforeEach(() => {
    account = new AccountMock({ balance: 1000, availableBalance: 100 });
    account.save();
  });

  describe('constructor', () => {

    let instance;
    let id;

    beforeEach(() => {
      getBalanceFake.resetHistory();
      instance = new BalancesMock({ account: account.id, context: context, balance: 100 }, 'Reserve');
      id = instance.id;
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id', id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('account', account.id);
    });

    it('should set account field', () => {
      expect(instance).to.have.property('context', context);
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
          getBalanceFake.resetHistory();
          new BalancesMock({ account: uuid(), context: context, balance: 0 }, 'Reserve');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given context is exist', () => {
      it('should throw an error', () => {
        expect(() => {
          getBalanceFake.resetHistory();
          new BalancesMock({ account: uuid(), context: context, balance: 0 }, 'Reserve');
        }).to.throw(InvalidRequestError);
      });
    });

    describe('Given balance is less than equal to 0', () => {
      it('should throw an error', () => {
        expect(() => {
          getBalanceFake.resetHistory();
          new BalancesMock({ account: uuid(), context: context, balance: -5 }, 'Reserve');
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {
    describe('Given balance does not exist', () => {
      let instance;
      beforeEach(() => {
        getBalanceFake.resetHistory();
        instance = new BalancesMock({ account: account.id, context: context, balance: 20 }, 'Reserve');
        instance.save();
      });
      it('should store to the `balanceDatabase`', () => {
        expect(balanceDatabaseMock[instance.id]).to.have.property('id').to.equals(instance.id);
      });
    });
  });

  describe('getBalance', () => {
    describe('Given balance does not exist', () => {
      expect(() => {
        BalancesMock.getBalance(uuid(), uuid(), 'Reserve');
      }).to.throw(InvalidRequestError);
    });

    describe('Given balance exist', () => {
      let instance;
      let result;
      beforeEach(() => {
        getBalanceFake.resetHistory();
        instance = new BalancesMock({account: account.id, context: context, balance: 50 }, 'Reserve');
        instance.save();
        result = BalancesMock.getBalance(account.id, context, 'Reserve');
      });

      it('should give the balance', () => {
        expect(result).to.deep.equals(instance);
      });

      it('should return a value of the instance', () => {
        expect(instance).to.deep.equals(result);
      });
    });
  });

  describe('getBalanceInfo', () => {
    describe('Given balance exist', () => {
      let instance;
      let result;
      beforeEach(() => {
        instance = new BalancesMock({account: account.id, context: 'd', balance: 50 }, 'Reserve');
        instance.save();
        result = BalancesMock.getBalance(account.id, 'd', 'Reserve');
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
        result = BalancesMock.getBalances(account.id, 'Reserve');
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
      instance = new BalancesMock({ account: account.id, context: 'e', balance: 20 }, 'Reserve');
      result = instance.save();
      result.update(20);
      balanceInfo = BalancesMock.getBalance(account.id, 'e', 'Reserve');
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