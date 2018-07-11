export class ValidationError extends Error {
  constructor(message: string) {
    super(message) /* istanbul ignore next */;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
