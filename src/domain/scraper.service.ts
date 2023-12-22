import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IRentData } from './rent.types';
import { PageWrapper } from './page/page.wrapper';
import { Rent } from './rent/rent.model';
import { Project } from './project.enum';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async getRentLinks(pageWrapper: PageWrapper) {
    if (pageWrapper.isRentPage) {
      await pageWrapper.gotoMainPage();
    }
    this.logger.debug('getRentLinks start');
    const { instance } = pageWrapper;
    const cardSelectorLink = pageWrapper.config.selectors.link;
    try {
      this.logger.debug(`getRentLinks selector: ${cardSelectorLink}`);

      const links = await pageWrapper.instance.$$(cardSelectorLink);
      const result: string[] = [];
      for (const link of links) {
        const text = await instance.evaluate(
          (el) => el.getAttribute('href'),
          link,
        );
        result.push(text);
      }

      this.logger.debug('getRentLinks result', links);
      return result;
    } catch (e) {
      this.logger.error('getRentLinks selector error', cardSelectorLink);
      this.logger.error('getRentLinks error', e);
    }
  }

  async getInnerText(page: Page, selector: string, errorPlaceholder?: string) {
    try {
      this.logger.debug('getInnerText selector', selector);
      const result = await page.$eval(
        selector,
        (el: HTMLElement) => el.innerText,
      );
      this.logger.debug('getRentLinks result', result);
      return result;
    } catch (e) {
      console.log(errorPlaceholder ?? e);
      return errorPlaceholder;
    }
  }

  async title(page: Page, errorPlaceholder = '[ERROR]') {
    return await this.getInnerText(
      page,
      '[data-name="OfferTitleNew"] h1',
      errorPlaceholder,
    );
  }

  async placementGeneral(page: Page, errorPlaceholder = '[placementGeneral]') {
    return await this.getInnerText(
      page,
      '[data-name="AddressContainer"]',
      errorPlaceholder,
    );
  }

  async price(page: Page, errorPlaceholder = '[price]') {
    return await this.getInnerText(
      page,
      '[data-name="AsideMainInfo"] [data-testid="price-amount"]',
      errorPlaceholder,
    );
  }

  async getAll(page: Page): Promise<Rent> {
    // await this.waiter(page);
    const title = await this.title(page);
    // const general = await this.placementGeneral(page);
    const pricePerMonth = await this.price(page);
    const id = parseInt(page.url().split('flat/')[1].slice(0, -1));
    return {
      title,
      platformId: id,

      //TODO: fetch this data also
      address: '',
      pricePerMonth: 0,
      commission: 0,
      floor: 0,
      totalFloor: 0,
      square: 0,
      description: '',
      parsedAt: Date.now(),
      project: Project.CIAN,
    };
  }

  // async scrapRentdebug() {
  //   const url = this.page.url();
  //   this.logger.debug('Started scraping: ', this.page.url());
  //   const data = await this.getAll(this.page);
  //   this.logger.debug('Finished scraping with success: ', url);
  //   return data;
  // }

  // private getLinkFromString(link: string) {
  //   return link.split('flat/')[1].slice(0, -1);
  // }

  // getWaitSelector() {
  //   if (this.isRentPage) {
  //     return this.config.waitingSelectors['rent'];
  //   } else {
  //     return this.config.waitingSelectors['main'];
  //   }
  // }

  // async waiter() {
  //   const waitSelector = this.getWaitSelector();
  //   this.logger.debug('Waiting for selector: ', waitSelector)
  //   await this.page.waitForSelector(waitSelector, { timeout: 15000 });
  //   this.logger.debug('Finished waiting for selector: ', waitSelector)
  // }

  // async getLinksFromPage() {
  //   const url = this.page.url();
  //   this.logger.debug('Started scraping links on url: ', url);
  //   const links = await Scraper.getRentLinks(
  //     this.page,
  //     this.config.selectors.card
  //   );
  //   const linkIds = links.map((l) => this.getLinkFromString(l));
  //   this.logger.debug('Finished scraping links with success: ', url);
  //   return { values: links, ids: linkIds };
  // }
}
