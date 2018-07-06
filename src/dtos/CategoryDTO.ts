import { Configuration } from '../config';
import { Category } from '../entities/Category';
import { ResourceBuilder } from '../util/ResourceBuilder';
import { IResourceDTO } from './ResourceDTO';

export interface ICategoryDTO extends IResourceDTO {
  id: number | null;
  name: string | null;
}

export class CategoryDTO implements ICategoryDTO {
  public static toDTO(entity: Category): CategoryDTO {
    const data: ICategoryDTO = {
      id: entity.id,
      name: entity.name,
    };
    return new ResourceBuilder<ICategoryDTO>(CategoryDTO, data)
      .addLink('self', `${Configuration.ROOT_PATH}/categories/${data.id}`)
      .addLink('delete', `${Configuration.ROOT_PATH}/categories/${data.id}`, 'DELETE')
      .addLink('update', `${Configuration.ROOT_PATH}/categories/${data.id}`, 'PUT')
      .build();
  }

  public id: number | null;
  public name: string | null;

  constructor(data: ICategoryDTO = {
    id: null,
    name: null,
  }) {
    this.id = data.id;
    this.name = data.name;
  }
}
