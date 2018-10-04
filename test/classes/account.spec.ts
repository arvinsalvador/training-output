import { expect } from 'chai';
import { v4 as uuid } from 'uuid';

import { Account } from './../../src/classes';
import { InvalidRequestError } from '../../src/errors';

describe('Account Class', () => {
  describe('constructor', () => {
    let instance;
    let id;
    beforeEach(() => {
      id = uuid();
      instance = new Account({ balance: 10, availableBalance: 100 });
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id', id);
    });

    it('should set balance field', () => {
      expect(instance).to.have.property('balance', 10);
    });

    it('should set availableBalance field', () => {
      expect(instance).to.have.property('availableBalance', 100);
    });

    describe('Given balance is less than 0', () => {
      it('should throw an error', () => {
        expect(() => {
          new Account({ balance: -1, availableBalance: 0 });
        }).to.throw(InvalidRequestError);
      });
    });
  });

  describe('save', () => {
    // TODO: Cannot access accountDatabase to ensure record exists
    it('should store to the `accountDatabase`');
  });

  describe('getAccount', () => {
    describe('Given account exist', () => {
      let id;
      let instance;
      let result;
      beforeEach(() => {
        id = uuid();
        instance = new Account({ balance: 100, availableBalance: 100 });
        result = instance.save();
      });

      it('should give the account', () => {
        expect(Account.getAccount(id)).to.deep.equals(instance);
      });

      it('should have a return value of the instance', () => {
        expect(instance).to.deep.equals(result);
      });
    });

    describe('Given account does not exist', () => {
      it('should throw an error');
    });
  });
});