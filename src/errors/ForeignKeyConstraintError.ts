export class ForeignKeyConstraintError extends Error {
  constructor(
    public constraint: string,
    public id: string | null = null,
    public table: string | null = null,
  ) {
    super(constraint);
    Object.setPrototypeOf(this, ForeignKeyConstraintError.prototype);
    if (this.id && this.table) {
      // tslint:disable-next-line:max-line-length
      this.message = `A foreign key constraint violation occurred. ${this.table.charAt(0).toUpperCase()}${this.table.slice(1)} with ID = ${this.id} does not exist`;
    }
  }
}
