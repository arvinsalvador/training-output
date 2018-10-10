import * as uuid from 'uuid/v4';

import { accountModel } from './../models/index';
import { InvalidRequestError } from './../errors';

export default class Account {

  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;

  constructor(data: { username, firstname, lastname, email }) {
    this.id = uuid();
    this.username = data.username;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
  }

  save() {
    accountModel.create({
      id: this.id,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email
    });
    return this;
  }

  static getAccount(id: string) {
    const account =  accountModel.findOne({
      where: { id: id },
    });

    if (!account) {
      throw new InvalidRequestError('', {
        accountExist: false
      });
    }

    return account;
  }
}