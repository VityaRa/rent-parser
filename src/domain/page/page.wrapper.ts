import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import { WebsiteConfig } from '../config.types';

export class PageWrapper {
  private readonly logger = new Logger(PageWrapper.name);
  config: WebsiteConfig;
  instance: Page;
  name: string;
  isRentPage: boolean;
  id: string;
  inParsing: boolean = false;

  constructor(config: WebsiteConfig, pageInstance: Page, uuid: string) {
    this.config = config;
    this.instance = pageInstance;
    this.isRentPage = false;
    this.id = uuid;
  }

  async goto(url: string, { isRentPage = false }: { isRentPage: boolean }) {
    this.isRentPage = isRentPage;
    this.logger.debug('Goto url', url);
    await Promise.all([await this.instance.goto(url)]);
    this.logger.debug('Goto finished');
  }

  async gotoMainPage(pageIndex: number) {
    await this.goto(this.buildUrl(pageIndex).toString(), { isRentPage: false });
    await this.waiter();
  }

  async gotoRentPage(url: string) {
    await this.goto(url, { isRentPage: true });
    await this.waiter();
  }

  getWaitSelector() {
    if (this.isRentPage) {
      return this.config.waitingSelectors['rent'];
    } else {
      return this.config.waitingSelectors['link'];
    }
  }

  async waiter() {
    const waitSelector = this.getWaitSelector();
    this.logger.debug('Waiting for selector: ', waitSelector);
    await this.instance.waitForSelector(waitSelector, { timeout: 15000 });
    this.logger.debug('Finished waiting for selector: ', waitSelector);
  }

  buildUrl(currentPaginationIndex: number) {
    const url = new URL(this.config.mainUrl);
    const searchParams = this.getSearchParams(currentPaginationIndex);
    searchParams.forEach((value, name) => {
      url.searchParams.append(name, value);
    });
    return url;
  }

  getSearchParams(paginationIndex: number = 1) {
    const params = {
      dealType: 'rent',
      offer_type: 'flat',
      engine_version: '2',
      currency: '3',
      region: '2',
      type: '4',
      maxprice: '35000',
      minprice: '20000',
      room1: "1",
      room2: "1",
      p: paginationIndex.toString(),
    };
    return new URLSearchParams(params);
  }
}
