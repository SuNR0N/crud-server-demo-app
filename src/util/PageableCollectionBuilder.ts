import { Request } from 'express';

import { IPageableCollectionDTO } from '../dtos/PageableCollectionDTO';
import { LinkBuilder } from './LinkBuilder';
import { Utils } from './Utils';

export class PageableCollectionBuilder<T = {}> extends LinkBuilder {
  constructor(
    private collection: T[],
    private request: Request,
    private offset: number,
    private pageSize: number,
    private total: number,
    private options: {
      firstLinkRel?: string,
      lastLinkRel?: string,
      nextLinkRel?: string,
      offsetParam?: string,
      pageSizeParam?: string,
      previousLinkRel?: string,
    } = {
      firstLinkRel: 'first',
      lastLinkRel: 'last',
      nextLinkRel: 'next',
      offsetParam: 'offset',
      pageSizeParam: 'page-size',
      previousLinkRel: 'previous',
    },
  ) {
    super();

    if (!Number.isInteger(offset) || !Number.isInteger(pageSize) || !Number.isInteger(total)) {
      throw new Error('Invalid arguments. "offset", "pageSize" and "total" arguments must be integers.');
    }
  }

  public build(): IPageableCollectionDTO<T> {
    const currentPage = Math.floor((this.offset + this.pageSize) / this.pageSize);
    const totalPages = Math.ceil(this.total / this.pageSize);
    const firstOffset = 0;
    const previousOffset = (this.offset - this.pageSize) > 0 ? (this.offset - this.pageSize) : 0;
    const nextOffset = (this.offset + this.pageSize) >= this.total ? this.offset : (this.offset + this.pageSize);
    const lastOffset = totalPages > 1 ? (totalPages - 1) * this.pageSize : 0;
    const urlWithPageSize = Utils.updateQueryStringParameter(
      this.request.originalUrl,
      this.options.pageSizeParam!,
      this.pageSize,
    );

    if (firstOffset < this.offset) {
      const firstHref = Utils.updateQueryStringParameter(urlWithPageSize, this.options.offsetParam!, firstOffset);
      this.addLink(this.options.firstLinkRel!, firstHref);
    }
    if (previousOffset < this.offset) {
      const previousHref = Utils.updateQueryStringParameter(urlWithPageSize, this.options.offsetParam!, previousOffset);
      this.addLink(this.options.previousLinkRel!, previousHref);
    }
    if (nextOffset > this.offset) {
      const nextHref = Utils.updateQueryStringParameter(urlWithPageSize, this.options.offsetParam!, nextOffset);
      this.addLink(this.options.nextLinkRel!, nextHref);
    }
    if (lastOffset > this.offset) {
      const lastHref = Utils.updateQueryStringParameter(urlWithPageSize, this.options.offsetParam!, lastOffset);
      this.addLink(this.options.lastLinkRel!, lastHref);
    }

    return Object.assign(
      {},
      {
        content: this.collection,
        currentPage,
        totalItems: this.total,
        totalPages,
      },
      super.build(),
    );
  }
}
