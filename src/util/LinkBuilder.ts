import {
  HTTPMethod,
  IHATEOASLink,
  IResourceDTO,
} from '../dtos/ResourceDTO';

export interface ILinkBuilder {
  addLink(name: string, href: string, method: HTTPMethod): ILinkBuilder;
  build(): IResourceDTO;
}

export class LinkBuilder implements ILinkBuilder {
  private links?: { [key: string]: IHATEOASLink };

  public addLink(name: string, href: string, method: HTTPMethod = 'GET'): this {
    if (!this.links) {
      this.links = {};
    }
    this.links[name] = { href, method };
    return this;
  }

  public build(): IResourceDTO {
    return {
      _links: this.links,
    };
  }
}
