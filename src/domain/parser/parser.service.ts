import { Injectable, OnApplicationBootstrap, Logger } from "@nestjs/common";
import { BrowserService } from "./browser.service";
import { chunkArray } from "../../utils/chunk.util";
import { CIAN_CONFIG } from "../config/cian/cian.config";
import { PageControllerService } from "../page/page-controller.service";
import { RentService } from "../rent/rent.service";
import { ScraperService } from "./scraper.service";
import { Project } from "../config/project.enum";

@Injectable()
export class ParserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ParserService.name);

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
    // await this.startParsing();
  }

  private async checkIfRentParsed(url: string) {
    return await this.rentService.findOne({ link: url });
  }

  async getRentDataFromUrl(url: string, project: Project) {
    this.logger.log(`parsePageByUrl started with url ${url}`);
    const openedPage = await this.pageControllerService.openPage(url, project);
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
  async startWithParams(maxRentCount = 1000, project = Project.CIAN) {
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
      const rentPromises = chunk.map((link) => this.getRentDataFromUrl(link, project));
      const rentDataList = await Promise.all(rentPromises);
      for (const rentData of rentDataList) {
        await this.rentService.create(rentData);
        createdCount += 1;
      }
    }

    this.logger.log(`createdCount is ${createdCount}`);
    this.currentSavedRents += createdCount;
    this.paginationIndex += 1;
    this.startWithParams(maxRentCount);
  }
}
