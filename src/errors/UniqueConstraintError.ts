export class UniqueConstraintError extends Error {
  constructor(
    public constraint: string,
    public key: string | null = null,
    public value: string | null = null,
  ) {
    super(constraint);
    Object.setPrototypeOf(this, UniqueConstraintError.prototype);
    if (this.key && this.value) {
      // tslint:disable-next-line:max-line-length
      this.message = `A unique constraint violation occurred. Key (${this.key}) with value (${this.value}) already exists`;
    }
  }
}
