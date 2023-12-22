import { Module } from '@nestjs/common';

import { BrowserService } from './browser.service';
import { FormatterService } from './formatter.service';
import { PageControllerService } from '../page/page-controller.service';
import { RentModule } from '../rent/rent.module';
import { ScraperService } from './scraper.service';

@Module({
  imports: [RentModule],
  controllers: [],
  providers: [
    BrowserService,
    PageControllerService,
    FormatterService,
    ScraperService,
  ],
})
export class ParserModule {}
