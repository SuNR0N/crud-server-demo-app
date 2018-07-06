import { Configuration } from '../config';
import { Publisher } from '../entities/Publisher';
import { ResourceBuilder } from '../util/ResourceBuilder';
import { IResourceDTO } from './ResourceDTO';

export interface IPublisherDTO extends IResourceDTO {
  id: number | null;
  name: string | null;
}

export class PublisherDTO implements IPublisherDTO {
  public static toDTO(entity: Publisher): PublisherDTO {
    const data: IPublisherDTO = {
      id: entity.id,
      name: entity.name,
    };
    return new ResourceBuilder<IPublisherDTO>(PublisherDTO, data)
      .addLink('self', `${Configuration.ROOT_PATH}/publishers/${data.id}`)
      .addLink('delete', `${Configuration.ROOT_PATH}/publishers/${data.id}`, 'DELETE')
      .addLink('update', `${Configuration.ROOT_PATH}/publishers/${data.id}`, 'PUT')
      .build();
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
