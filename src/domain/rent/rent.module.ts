import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rent, RentSchema } from './rent.model';
import { RentRepository } from './rent.repository';
import { RentService } from './rent.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }]),
  ],
  providers: [RentRepository, RentService],
  exports: [RentService],
})
export class RentModule {}
