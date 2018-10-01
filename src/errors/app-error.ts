export default class AppError extends Error {
  code: string;
  meta: {};

  constructor (code: string, message: string, meta = {}) {
    super(message);

    this.code = code;
    this.meta = meta;
  }
}
