import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoletosModule } from './boletos/boletos.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    BoletosModule,
    MulterModule.register({
      dest: '/tmp',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
