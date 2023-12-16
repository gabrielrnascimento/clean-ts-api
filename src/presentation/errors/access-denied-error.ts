/* istanbul ignore next */
export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied');
    this.name = 'AccessDeniedError';
  }
}
