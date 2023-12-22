import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class FormatterService {
  private readonly logger = new Logger(FormatterService.name);
}
