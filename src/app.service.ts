import {
  Injectable,
  Logger,
  OnApplicationBootstrap
} from '@nestjs/common';
import { ParserService } from './domain/parser/parser.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly parserService: ParserService
  ) {}

  async onApplicationBootstrap() {
  }
}
