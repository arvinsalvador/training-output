import * as uuid from 'uuid/v4';
import * as chai from 'chai';
import { describe } from 'mocha';
import * as chaiAsPromised from 'chai-as-promised';

import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { InvalidRequestError } from '../../src/errors';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Balance', () => {
  describe('cosntructor', () => {
    const BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
      '../models': {
        balanceModel: {}
      },
      './index': {
        BalanceType: {}
      }
    })).default;

    let balance;
    let id;

    const accountId = uuid();
    const context = uuid();

    beforeEach(() => {
      balance = new BalanceMock({
        account: accountId,
        context: context,
        balance: 50,
      }, 'Reserve');

      id = balance.id;
    });

    it('should set id field', () => {
      expect(balance).to.have.property('id', id);
    });

    it('should set account field', () => {
      expect(balance).to.have.property('account', accountId);
    });

    it('should set context field', () => {
      expect(balance).to.have.property('context', context);
    });

    it('should set balance field', () => {
      expect(balance).to.have.property('balance', 50);
    });

    it('should set type field', () => {
      expect(balance).to.have.property('type', 'Reserve');
    });

    describe('Given balance is less than equal to zero', () => {
      it('should throw an error', () => {
        expect(() => {
          new BalanceMock({
            account: uuid(),
            context: uuid(),
            balance: 0,
          }, 'Virtual');
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {

    const typesFake = sinon.spy();
    const createFake = sinon.spy();
    const updateFake = sinon.spy();

    const BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
      '../models': {
        balanceModel: {
          create: createFake,
          update: updateFake
        }
      },
      './index': {
        BalanceType: {
          TYPES: typesFake
        }
      }
    })).default;

    let instance;

    const accountId = uuid();
    const context = uuid();

    beforeEach(async () => {
      instance = new BalanceMock({
        account: accountId,
        context: context,
        balance: 50
      }, 'Main');
      await instance.save();
    });

    describe('Given balance type is reserve', () => {
      let balance;
      beforeEach(async () => {
        balance = new BalanceMock({
          account: accountId,
          context: context,
          balance: 20,
        }, 'Reserve');
        await balance.save();
      });

      it('should call Balance update', async () => {
        //need more resource with mocking a static method inside a the class.
      });
    });

    it('should call balanceModel create', async () => {
      await expect(createFake.lastCall.lastArg)
        .to.have.property('id');
    });
  });

  describe('getBalance', () => {
    describe('Given balance does not exist', () => {
      let BalanceMock;

      const findOneFake = sinon.spy(() => {
        return false;
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let result;

      beforeEach(() => {
        result = BalanceMock.getBalance({ id: uuid() });
      });

      it('should throw an error', async () => {
        await expect(result).to.eventually.rejectedWith(InvalidRequestError);
      });
    });

    describe('Given balance exist', () => {
      let id = uuid();
      let BalanceMock;

      const findOneFake = sinon.spy(() => {
        return {
          id: id,
          account: uuid(),
          context: uuid(),
          balance: 100,
          type: 'Reserve'
        };
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let result;

      beforeEach(async () => {
        result = await BalanceMock.getBalance({ id: id });
      });

      it('should return value of balance', async () => {
        await expect(result).to.have.property('id').to.equal(id);
      });
    });
  });

  describe('checkBalance', () => {
    describe('Given balance exist', () => {
      let BalanceMock;

      const findOneFake = sinon.spy(() => {
        return {};
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let result;

      beforeEach(() => {
        result = BalanceMock.checkBalance({ id: uuid() });
      });

      it('should throw an error', async () => {
        await expect(result).to.eventually.rejectedWith(InvalidRequestError);
      });
    });

    describe('Given balance does not exist', () => {
      let BalanceMock;

      const findOneFake = sinon.spy(() => {
        return false;
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let result;

      beforeEach(async () => {
        result = await BalanceMock.checkBalance({ id: uuid() });
      });

      it('should return false', async () => {
        await expect(result).to.equal(false);
      });
    });
  });

  describe('getBalances', () => {
    describe('Given balance does not exist', () => {
      let BalanceMock;

      const findAllFake = sinon.spy(() => {
        return false;
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findAll: findAllFake
          }
        }
      })).default;

      let result;

      beforeEach(() => {
        result = BalanceMock.getBalances(uuid(), 'Reserve');
      });

      it('should return an error', async () => {
        await expect(result).to.eventually.rejectedWith(InvalidRequestError);
      });
    });

    describe('Given balance exist', () => {
      let BalanceMock;
      let accountId = uuid();

      const findAllFake = sinon.spy(() => {
        return [{
          id: uuid(),
          account: accountId,
          context: uuid(),
          balance: 20,
          type: 'Reserve'
        }, {
          id: uuid(),
          account: accountId,
          context: uuid(),
          balance: 30,
          type: 'Reserve'
        }];
      });

      BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
        '../models': {
          balanceModel: {
            findAll: findAllFake
          }
        }
      })).default;

      let result;

      beforeEach(async () => {
        result = await BalanceMock.getBalances(accountId, 'Reserve');
      });

      it('should return value of balances', async () => {
        await expect(result).to.be.an('array');
      });
    });
  });

  describe('deleteRecord', () => {
    let BalanceMock;

    const destroyFake = sinon.spy(async () => {
      return 1;
    });

    BalanceMock = (proxyquire('./../../src/classes/balance.ts', {
      '../models': {
        balanceModel: {
          destroy: destroyFake
        }
      }
    })).default;

    let result;
    let id;

    beforeEach(async () => {
      result = await BalanceMock.deleteRecord({ id: id });
    });

    it('should call balanceModel destroy', async() => {
      await expect(destroyFake.calledOnceWith('id', id));
    });

    it('should destroy record', async () => {
      await expect(result).to.equal(true);
    });
  });
});
