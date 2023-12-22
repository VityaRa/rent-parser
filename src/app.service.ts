import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Render,
} from '@nestjs/common';
import { BrowserService } from './domain/browser.service';
import { PageControllerService } from './domain/page/page-controller.service';
import { Project } from './domain/project.enum';
import { ScraperService } from './domain/scraper.service';
import { CIAN_CONFIG } from './domain/cian/cian.config';
import { RentService } from './domain/rent/rent.service';
import { Rent } from './domain/rent/rent.model';
import { chunkArray } from './domain/chunk.util';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  private paginationIndex = 1;
  private currentSavedRents = 0;

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

  async checkIfRentParsed(url: string) {
    return await this.rentService.findOne({ link: url });
  }

  async parsePageByUrl(url: string) {
    this.logger.log(`parsePageByUrl started with url ${url}`);
    const openedPage = await this.pageControllerService.openPage(url);
    const rentData = await this.scraperService.getAll(openedPage);
    this.pageControllerService.remove(openedPage.id);
    this.logger.log(`parsePageByUrl finished with url ${url}`);
    return rentData;
  }

  async getRentLinks(paginationIndex: number) {
    this.logger.log(`getRentLinks started with ${paginationIndex}`);
    const page = await this.browserService.createPageInstance();
    const pageWrapper = this.pageControllerService.add(CIAN_CONFIG, page);
    await pageWrapper.gotoMainPage(paginationIndex);
    const rentLinks = await this.scraperService.getRentLinks(
      paginationIndex,
      pageWrapper,
    );
    this.pageControllerService.remove(pageWrapper.id);
    this.logger.log(`getRentLinks finished with ${paginationIndex}`);
    return rentLinks;
  }

  //TODO: fix infinite work when pagination ended
  async startParsing(maxRentCount = 1000) {
    this.logger.log(`currentSavedRents is ${this.currentSavedRents}`);
    this.logger.log(`paginationIndex is ${this.paginationIndex}`);
    const rentLinks = await this.getRentLinks(this.paginationIndex);

    if (this.currentSavedRents > maxRentCount) {
      this.logger.log('startParsing Limit reached');
      return;
    }

    const alreadyParsedRents = await Promise.all(
      rentLinks.map((rentLink) => this.checkIfRentParsed(rentLink)),
    );

    const alreadyParsedLinks = alreadyParsedRents
      .filter((rent) => rent)
      .map((a) => a.link);

    const filteredRentLinks = rentLinks.filter(
      (link) => !alreadyParsedLinks.includes(link),
    );

    const chunckedRents: string[][] = chunkArray(filteredRentLinks, 10);
    let createdCount = 0; 
    
    for (const chunk of chunckedRents) {
      const rentPromises = chunk.map((link) => this.parsePageByUrl(link));
      const rentDataList = await Promise.all(rentPromises);
      for (const rentData of rentDataList) {
        await this.rentService.create(rentData);
        createdCount += 1;
      }
    }

    this.logger.log(`createdCount is ${createdCount}`);
    this.currentSavedRents += createdCount;
    this.paginationIndex += 1;
    this.startParsing(maxRentCount);
  }
}
