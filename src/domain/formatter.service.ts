import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { CIAN_ROOM_COUNT_MAPPER } from './cian/cian.mapper';

@Injectable()
export class FormatterService {
  private readonly logger = new Logger(FormatterService.name);

  pricePerMonth(value: string) {
    return parseInt(value.replaceAll(/\xA0/g, '').split('₽/мес.')[0]);
  }

  roomCount(value: string) {
    try {
      const stringRoomCount = value.split(',')[0];
      const roomCount = CIAN_ROOM_COUNT_MAPPER[stringRoomCount];
      return roomCount || -1;
    } catch (e) {
      return -1;
    }
  }

  square(value: string) {
    const squareString = parseFloat(value.split(', ')[1].split(' ')[0]);
    return squareString;
  }

  floor(value: string) {
    return parseInt(value.split(' из ')[0]);
  }

  totalFloor(value: string) {
    try {
      return parseInt(value.split(' из ')[1]) || -1;
    } catch (e) {
      return -1;
    }
  }

  platformId(url: string) {
    return parseInt(url.split('flat/')[1].slice(0, -1));
  }

  address(value: string) {
    return value.replace('На карте', '');
  }

  commission(value: string) {
    try {
      return parseInt(value.replace('%', '')) || -1;
    } catch (e) {
      return -1
    }
  }
}
