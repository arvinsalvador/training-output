import * as uuid from 'uuid/v4';

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
}