import { Publisher } from '../entities/Publisher';

export interface IPublisherUpdateDTO {
  name: string;
}

export class PublisherUpdateDTO implements IPublisherUpdateDTO {
  public name: string;

  constructor(data: IPublisherUpdateDTO) {
    this.name = data.name;
  }

  public toEntity = (): Partial<Publisher> => ({
    name: this.name,
  })
}
