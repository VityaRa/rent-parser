import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ParserModule } from './domain/parser/parser.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017'),
    ParserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
