import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BrowserService } from './domain/browser.service';
import { PageControllerService } from './domain/page/page-controller.service';
import { Project } from './domain/project.enum';
import { ScraperService } from './domain/scraper.service';
import { CIAN_CONFIG } from './domain/cian/cian.config';
import { RentService } from './domain/rent/rent.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private browserService: BrowserService,
    private pageControllerService: PageControllerService,
    private scraperService: ScraperService,
    private rentService: RentService,
  ) {}
  async onApplicationBootstrap() {
    await this.browserService.start();
    await this.startParsing();
  }

  //TODO: add paginate page
  async getRentLinks() {
    const page = await this.browserService.createPageInstance();
    const pageWrapper = this.pageControllerService.add(CIAN_CONFIG, page);
    await pageWrapper.gotoMainPage();
    const rentLinks = await this.scraperService.getRentLinks(pageWrapper);
    return rentLinks;
  }

  async startParsing() {
    const rentLinks = await this.getRentLinks();
    // this.pageControllerService.addRentLinks(rentLinks);
    for (const rentLink of rentLinks) {
      const page = await this.browserService.createPageInstance();
      const pageWrapperInstance = this.pageControllerService.add(CIAN_CONFIG, page);
      await pageWrapperInstance.gotoRentPage(rentLink);
      const rentData = await this.scraperService.getAll(pageWrapperInstance.instance);
      await this.rentService.create(rentData);
    }
  }

  async parse() {
    const pagesToParse = this.pageControllerService.getPagesToParse({
      count: 10,
      project: Project.CIAN,
    });

    const data = [];
    for (const page of pagesToParse) {
      const pageData = await this.scraperService.getAll(page.instance);
      data.push(pageData);
    };

    return data
  }
}
