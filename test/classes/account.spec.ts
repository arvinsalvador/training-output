import * as chai from 'chai';
import { describe } from 'mocha';
import * as chaiAsPromise from 'chai-as-promised';

import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { InvalidRequestError } from '../../src/errors';
import uuid = require('uuid');

chai.use(chaiAsPromise);
const { expect } = chai;

describe('Account Class', () => {

  describe('constructor', () => {
    let AccountMock;
    let instance;
    let id;

    AccountMock = (proxyquire('./../../src/classes/account.ts', {
      './../models/index': {}
    })).default;

    beforeEach(() => {
      instance = new AccountMock({
        username: 'sampleuser',
        firstname: 'Juan',
        lastname: 'Dela Cruz',
        email: 'juandelacruz@mail.com',
      });
      id = instance.id;
    });

    it('should set id field', () => {
      expect(instance).to.have.property('id').to.equals(id);
    });

    it('should set username field', () => {
      expect(instance).to.have.property('username').to.equals('sampleuser');
    });

    it('should set firstname field', () => {
      expect(instance).to.have.property('firstname').to.equals('Juan');
    });

    it('should set lastname field', () => {
      expect(instance).to.have.property('lastname').to.equals('Dela Cruz');
    });

    it('should set email field', () => {
      expect(instance).to.have.property('email').to.equals('juandelacruz@mail.com');
    });
  });

  describe('save', () => {
    describe('Given account exist', () => {
      let AccountMock;
      const findOneFake = sinon.spy(async () => {
        return {};
      });

      AccountMock = (proxyquire('./../../src/classes/account.ts', {
        './../models/index': {
          accountModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let instance;

      beforeEach(() => {
        instance = new AccountMock({
          username: 'sampleuser',
          firstname: 'Juan',
          lastname: 'Dela Cruz',
          email: 'juandelacruz@mail.com',
        });
      });

      it('should throw an error', async () => {
        await expect(instance.save())
          .to.eventually.rejectedWith(InvalidRequestError);
      });
    });

    describe('Given account does not exist', () => {
      let AccountMock;
      const findOneFake = sinon.spy(() => {
        return false;
      });
      const createFake = sinon.spy();

      AccountMock = (proxyquire('./../../src/classes/account.ts', {
        './../models/index': {
          accountModel: {
            findOne: findOneFake,
            create: createFake
          }
        }
      })).default;

      let instance;

      beforeEach(async () => {
        instance = new AccountMock({
          username: 'sampleuser',
          firstname: 'Juan',
          lastname: 'Dela Cruz',
          email: 'juandelacruz@mail.com',
        });
        await instance.save();
      });

      it('should call the accountModel create', async () => {
        await expect(createFake.lastCall.lastArg)
          .to.have.property('id').to.equal(instance.id);
      });

      it('should return the instance', () => {
        expect(instance).to.have.property('id');
      });
    });
  });

  describe('getAccount', () => {
    describe('Given account does not exist', () => {
      let AccountMock;

      const findOneFake = sinon.spy(() => {
        return false;
      });

      AccountMock = (proxyquire('./../../src/classes/account.ts', {
        './../models/index': {
          accountModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let account;

      beforeEach(() => {
        account = AccountMock.getAccount({ id: uuid() });
      });

      it('should throw an error', async () => {
        await expect(account).to.eventually.rejectedWith(InvalidRequestError);
      });
    });

    describe('Given account exist', () => {
      let AccountMock;
      let uid = uuid();

      const findOneFake = sinon.spy(async () => {
        return {
          id: uid,
          username: 'sampleuser',
          firstname: 'Juan',
          lastname: 'Dela Cruz',
          email: 'juandelacruz@gmail.com',
        };
      });

      AccountMock = (proxyquire('./../../src/classes/account.ts', {
        './../models/index': {
          accountModel: {
            findOne: findOneFake
          }
        }
      })).default;

      let account;

      beforeEach(async () => {
        account = await AccountMock.getAccount({ id: uid });
      });

      it('should return value of account', async () => {
        await expect(account)
          .to.have.property('id').to.equal(uid);
      });
    });
  });
});