import { Category } from '../entities/Category';

export interface ICategoryDTO {
  id: number | null;
  name: string | null;
}

export class CategoryDTO implements ICategoryDTO {
  public static toDTO(entity: Category): CategoryDTO {
    const data: ICategoryDTO = {
      id: entity.id,
      name: entity.name,
    };
    return new CategoryDTO(data);
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
