import { IResourceDTO } from '../dtos/ResourceDTO';
import { LinkBuilder } from './LinkBuilder';

export class ResourceBuilder<T extends IResourceDTO> extends LinkBuilder {
  constructor(
    private ctr: { new(data: T): T },
    private data: T,
  ) {
    super();
  }

  public build(): T {
    const instance = new this.ctr(this.data);
    return Object.assign(
      {},
      instance,
      super.build(),
    );
  }
}
