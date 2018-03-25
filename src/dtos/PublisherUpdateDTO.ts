export interface IPublisherUpdateDTO {
  name: string;
}

export class PublisherUpdateDTO implements IPublisherUpdateDTO {
  public name!: string;
}
