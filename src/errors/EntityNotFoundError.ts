export class EntityNotFoundError<T> extends Error {
  public id: any;
  public entity: string;

  constructor(entity: { new(): T }, id: any) {
    super() /* istanbul ignore next */;
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
    this.id = id;
    this.entity = entity.name;
    this.message = `${this.entity} with ID = ${this.id} does not exist`;
  }
}
