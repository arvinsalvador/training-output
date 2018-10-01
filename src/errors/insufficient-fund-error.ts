import AppError from './app-error';

export default class InsufficientFundErrror extends AppError {
  constructor(meta: {} = {}) {
    super('INSUFFICIENT_FUNDS', '', meta);
  }
}