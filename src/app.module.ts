import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    HttpModule,
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike('City Weather API', {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
