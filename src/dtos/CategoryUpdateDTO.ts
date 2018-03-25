export interface ICategoryUpdateDTO {
  name: string;
}

export class CategoryUpdateDTO implements ICategoryUpdateDTO {
  public name!: string;
}
