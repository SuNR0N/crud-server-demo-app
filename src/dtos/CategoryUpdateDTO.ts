import { Category } from '../entities/Category';

export interface ICategoryUpdateDTO {
  name: string;
}

export class CategoryUpdateDTO implements ICategoryUpdateDTO {
  public name: string;

  constructor(data: ICategoryUpdateDTO) {
    this.name = data.name;
  }

  public toEntity = (): Partial<Category> => ({
    name: this.name,
  })
}
