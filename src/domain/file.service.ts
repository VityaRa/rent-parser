import { Injectable, Logger } from '@nestjs/common';
import { writeFile } from 'node:fs';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  gen(fileName: string, data: any, debug: boolean = true) {
    const path = 'parser-results';
    const jsonFile = `${fileName}.json`;
    const fullPath = `${path}/${jsonFile}`;
    this.logger.debug(`Starting file '${jsonFile}' saving`);
    writeFile(fullPath, JSON.stringify(data, null, 2), function (error) {
      if (error) {
        this.logger.error(`File 'jsonFile' saving error: ${error}`);
        throw error;
      }
      this.logger.info(`File '${jsonFile}' saved`);
    });
  }
}
