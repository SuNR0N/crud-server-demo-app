import { Publisher } from '../entities/Publisher';

export interface IPublisherDTO {
  id: number | null;
  name: string | null;
}

export class PublisherDTO implements IPublisherDTO {
  public static toDTO(entity: Publisher): PublisherDTO {
    const data: IPublisherDTO = {
      id: entity.id,
      name: entity.name,
    };
    return new PublisherDTO(data);
  }

  public id: number | null;
  public name: string | null;

  constructor(data: IPublisherDTO = {
    id: null,
    name: null,
  }) {
    this.id = data.id;
    this.name = data.name;
  }
}
