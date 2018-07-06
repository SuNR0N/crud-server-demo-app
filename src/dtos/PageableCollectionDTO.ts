import { IResourceDTO } from './ResourceDTO';

export interface IPageableCollectionDTO<T> extends IResourceDTO {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
