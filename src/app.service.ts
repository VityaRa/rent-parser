import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Render,
} from '@nestjs/common';
import { BrowserService } from './domain/parser/browser.service';
import { PageControllerService } from './domain/page/page-controller.service';
import { Project } from './domain/config/project.enum';
import { ScraperService } from './domain/parser/scraper.service';
import { CIAN_CONFIG } from './domain/config/cian/cian.config';
import { RentService } from './domain/rent/rent.service';
import { Rent } from './domain/rent/rent.model';
import { chunkArray } from './utils/chunk.util';
import { ParserService } from './domain/parser/parser.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly parserService: ParserService
  ) {}

}
