import * as Sequelize from 'sequelize';

import { sequelize } from './../libs/';

const accountModel = sequelize.define('Account', {
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