import { Module } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  providers: [BoletosService, PrismaService],
  controllers: [BoletosController],
  exports: [BoletosService],
})
export class BoletosModule {}
