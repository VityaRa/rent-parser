import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { PageWrapper } from './page.wrapper';
import { WebsiteConfig } from '../config.types';
import { Project } from '../project.enum';
import { BrowserService } from '../browser.service';
import { CIAN_CONFIG } from '../cian/cian.config';

interface PageQueryParams {
  count: number;
  project: Project | 'all';
}

interface PageMap {
  [key: string]: PageWrapper;
}

@Injectable()
export class PageControllerService {
  private readonly logger = new Logger(PageControllerService.name);
  private pageMap: PageMap = {};
  private rentLinks: string[] = [];

  constructor(
    private readonly browserService: BrowserService,
  ) {

  }

  get(id: string): PageWrapper {
    return this.pageMap[id];
  }

  getInstance(id: string) {
    return this.get(id).instance;
  }

  private createWrapper(
    config: WebsiteConfig,
    pageInstance: Page,
  ): PageWrapper {
    const uuid = uuidv4();
    return new PageWrapper(config, pageInstance, uuid);
  }

  add(config: WebsiteConfig, pageInstance: Page) {
    const uuid = uuidv4();
    this.pageMap[uuid] = this.createWrapper(config, pageInstance);
    this.logger.debug(
      `Created page instance with id = ${uuid} and project = ${config.project}`,
    );

    return this.pageMap[uuid];
  }

  remove(id: string) {
    const {
      instance,
      config: { project },
    } = this.get(id);
    instance.close();
    delete this.pageMap[id];
    this.logger.debug(
      `Removed page instance with id = ${id} and project = ${project}`,
    );
  }

  getPagesToParse(params: PageQueryParams = { count: 10, project: 'all' }) {
    const pagesList: PageWrapper[] = [];
    for (const pageId in this.pageMap) {
      if (pagesList.length >= params.count) {
        return pagesList;
      }
      const page = this.pageMap[pageId];
      if (
        !page.inParsing &&
        (params.project === 'all' || page.config.project === params.project)
      ) {
        pagesList.push(page);
      }
    }
    return pagesList;
  }

  startWork(pageWrapper: PageWrapper) {
    pageWrapper.inParsing = true;
  }

  addRentLinks(rentLinks: string[]) {
    this.rentLinks = [...this.rentLinks, ...rentLinks];
  }

  getRentLinks() {
    return this.rentLinks;
  }
}
