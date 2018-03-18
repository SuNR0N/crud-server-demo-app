export interface ICrudRepository<T, U> {
  count(): number;
  delete(key: U): void;
  exists(key: U): boolean;
  findAll(): T[];
  findOne(key: U): T;
  save(entity: T): T;
}
