import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BrowserService } from './domain/browser.service';
import { PageControllerService } from './domain/page/page-controller.service';
import { FormatterService } from './domain/formatter.service';
import { FileService } from './domain/file.service';
import { ScraperService } from './domain/scraper.service';
import { RentModule } from './domain/rent/rent.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://localhost:27017'), RentModule],
  controllers: [],
  providers: [AppService, BrowserService, PageControllerService, FormatterService, FileService, ScraperService],
})
export class AppModule {}
