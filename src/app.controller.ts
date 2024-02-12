import {
  Injectable,
  Logger
} from '@nestjs/common';

@Injectable()
export class AppController {
  private readonly logger = new Logger(AppController.name);

}
