import Sequelize from 'sequelize';
import { Logger } from 'highoutput-utilities';

const logger = new Logger(['sequelize']);

export default new Sequelize(
  process.env.POSTGRES_DB || 'onewallet',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || '',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: process.env.POSTGRES_POOL_MAX ? parseInt(process.env.POSTGRES_POOL_MAX, 10) : 12,
      min: process.env.POSTGRES_POOL_MIN ? parseInt(process.env.POSTGRES_POOL_MIN, 10) : 2,
      acquire: 30000,
      idle: 10000,
    },

    logging: log => logger.verbose(log),
  },
);