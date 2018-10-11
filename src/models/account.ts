import * as Sequelize from 'sequelize';

import { sequelize } from './../libs/';

interface AccountAttributes {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

type AccountInstance = Sequelize.Instance<AccountAttributes> & AccountAttributes;

const accountModel = sequelize.define<AccountInstance, AccountAttributes>('Account', {
  id: {
    type: Sequelize.CHAR(36),
    primaryKey: true
  },
  username: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING
}, {
  tableName: 'Account'
});

export default accountModel;