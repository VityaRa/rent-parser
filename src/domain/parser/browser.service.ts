import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name);
  private instance: Browser;

  async start() {
    try {
      this.logger.debug(`Opening the browser`);
      this.instance = await puppeteer.launch({
        headless: false,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
      this.logger.debug(`Finished opening the browser`);
      return this.instance;
    } catch (err) {
      this.logger.error('Could not create a browser instance => : ', err);
    }
  }

  async stop() {
    this.logger.debug(`Stopping browser instance`)
    await this.instance.close();
    this.logger.debug(`Browser instance stopped`)
  }

  async createPageInstance(id?: string) {
    this.logger.debug(`Creating page instance: ${id || ''}`)
    const page = await this.instance.newPage()
    this.logger.debug(`Page instance created: ${id || ''}`)
    return page;
  }
}