import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ReportesService],
  controllers: [ReportesController],
  imports:[PrismaModule]
})
export class ReportesModule {}
