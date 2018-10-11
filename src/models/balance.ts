import * as Sequelize from 'sequelize';

import { sequelize } from './../libs/';

interface BalanceAttributes {
  id: string;
  account: string;
  context: string;
  balance: number;
  type: string;
}

type BalanceInstance = Sequelize.Instance<BalanceAttributes> & BalanceAttributes;

const balanceModel = sequelize.define<BalanceInstance, BalanceAttributes>('Balance', {
  id: {
    type: Sequelize.CHAR(36),
    primaryKey: true
  },
  account: Sequelize.STRING,
  context: Sequelize.STRING,
  balance: Sequelize.REAL,
  type: Sequelize.STRING
}, {
  tableName: 'Balance'
});

export default balanceModel;