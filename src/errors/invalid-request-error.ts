import AppError from './app-error';

export default class InvalidRequestError extends AppError {
  constructor(description: string, meta: {} = {}) {
    super('INVALID_REQUEST', description, meta);
  }
}
