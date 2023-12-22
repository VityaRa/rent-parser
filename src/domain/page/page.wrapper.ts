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

  async gotoMainPage() {
    await this.goto(this.buildUrl().toString(), { isRentPage: false });
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

  // async getLinksFromPage() {
  //   const url = this.instance.url();
  //   this.logger.debug('Started scraping links on url: ', url);
  //   const links = await Scraper.getRentLinks(
  //     this.instance,
  //     this.config.selectors.card,
  //   );
  //   const linkIds = links.map((l) => this.getLinkFromString(l));
  //   this.logger.debug('Finished scraping links with success: ', url);
  //   return { values: links, ids: linkIds };
  // }

  // async scrapRentInfo() {
  //   const url = this.instance.url();
  //   this.logger.debug('Started scraping: ', this.instance.url());
  //   const data = await Scraper.getAll(this.instance);
  //   this.logger.debug('Finished scraping with success: ', url);
  //   return data;
  // }

  // private getLinkFromString(link: string) {
  //   return link.split('flat/')[1].slice(0, -1);
  // }

  buildUrl() {
    const url = new URL(this.config.mainUrl);
    const searchParams = this.getSearchParams();
    searchParams.forEach((value, name) => {
      url.searchParams.append(name, value);
    });
    return url;
  }

  getSearchParams() {
    const params = {
      dealType: 'rent',
      offer_type: 'flat',
      engine_version: '2',
      currency: '3',
      region: '2',
      type: '4',

      maxprice: '35000',
      minprice: '20000',
    };
    return new URLSearchParams(params);
  }

  // async scrap() {
  //   this.logger.debug('start scraping')
  //   await this.instance.goto(this.config.url);
  //   this.logger.debug(`on instance: ${this.config.url}`);
  //   await this.instance.waitForSelector(this.config.cardSelector, {
  //     timeout: 6000,
  //   });
  //   this.logger.debug(`wait for selector: ${this.config.cardSelector}`);

  //   const links = await this.parsePaginatedPage();
  //   await this.processLinks(links);
  // }

  // async processLinks(links: string[]) {
  //   for (const link of links) {
  //     this.logger.debug(`got link: ${link}`);
  //     const data = await this.parseRentPage(link);
  //     console.debug(data);
  //     this.instance.goBack();
  //   }
  // }

  // async parsePaginatedPage() {
  //   return await this.instance.$$eval(this.config.cardSelector, (a) =>
  //     a.map((e: HTMLLinkElement) => e.href)
  //   );
  // }

  // async parseRentPage(link: string) {
  //   this.logger.debug(`goto link: ${link}`);
  //   await Promise.all([
  //     this.instance.goto(link),
  //     this.instance.waitForNavigation(),
  //   ])
  //   this.logger.debug(`scraper start: ${link}`);
  //   const data = await Scraper.getAll(this.instance);
  //   this.logger.debug(`scraper finished: ${link}`);
  //   return data;
  // }
}
