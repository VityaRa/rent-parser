import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { PageWrapper } from './page/page.wrapper';
import { Rent } from './rent/rent.model';
import { Project } from './project.enum';
import { FormatterService } from './formatter.service';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(private readonly formatterService: FormatterService) {}

  async getRentLinks(paginationNumber: number = 0,pageWrapper: PageWrapper) {
    if (pageWrapper.isRentPage) {
      await pageWrapper.gotoMainPage(paginationNumber);
    }
    // this.logger.debug('getRentLinks start');
    const { instance } = pageWrapper;
    const cardSelectorLink = pageWrapper.config.selectors.link;
    try {
      // this.logger.debug(`getRentLinks selector: ${cardSelectorLink}`);

      const links = await pageWrapper.instance.$$(cardSelectorLink);
      const result: string[] = [];
      for (const link of links) {
        const text = await instance.evaluate(
          (el) => el.getAttribute('href'),
          link,
        );
        result.push(text);
      }

      // this.logger.debug('getRentLinks result', links);
      return result;
    } catch (e) {
      // this.logger.error('getRentLinks selector error', cardSelectorLink);
      this.logger.error('getRentLinks error', e);
    }
  }

  async getInnerText(page: Page, selector: string, errorPlaceholder?: string) {
    try {
      // this.logger.debug('getInnerText selector', selector);
      const result = await page.$eval(
        selector,
        (el: HTMLElement) => el.innerText,
      );
      // this.logger.debug('getRentLinks result', result);
      return result;
    } catch (e) {
      // console.log(errorPlaceholder ?? e);
      return errorPlaceholder;
    }
  }

  async getPricePerMonthText(page: PageWrapper) {
    return await this.getInnerText(
      page.instance,
      page.config.selectors.pricePerMonth,
    );
  }

  async getSquareText(page: PageWrapper) {
    return await this.getInnerText(page.instance, page.config.selectors.square);
  }

  async getFloor(page: PageWrapper) {
    return await this.getInnerText(page.instance, page.config.selectors.floor);
  }

  async getAddress(page: PageWrapper) {
    return await this.getInnerText(
      page.instance,
      page.config.selectors.address,
    );
  }

  async getTitle(page: PageWrapper) {
    return await this.getInnerText(page.instance, page.config.selectors.title);
  }

  async getDescription(page: PageWrapper) {
    return await this.getInnerText(
      page.instance,
      page.config.selectors.description,
    );
  }

  async getCommision(page: PageWrapper) {
    return await this.getInnerText(
      page.instance,
      page.config.selectors.commission,
    );
  }

  async getAll(page: PageWrapper): Promise<Rent> {
    const [
      pricePerMonth,
      square,
      roomCount,
      floor,
      totalFloor,
      address,
      title,
      description,
      commission,
    ] = await Promise.all([
      this.getPricePerMonthText(page),
      this.getSquareText(page),
      this.getSquareText(page),
      this.getFloor(page),
      this.getFloor(page),
      this.getAddress(page),
      this.getTitle(page),
      this.getDescription(page),
      this.getCommision(page),
    ]);

    return {
      pricePerMonth: this.formatterService.pricePerMonth(pricePerMonth),
      roomCount: this.formatterService.roomCount(roomCount),
      square: this.formatterService.square(square),
      floor: this.formatterService.floor(floor),
      totalFloor: this.formatterService.totalFloor(totalFloor),
      platformId: this.formatterService.platformId(page.instance.url()),
      link: page.instance.url(),
      address: this.formatterService.address(address),
      parsedAt: Date.now(),
      project: page.config.project,
      title,
      commission: this.formatterService.commission(commission),
      description,
    };
  }
}
