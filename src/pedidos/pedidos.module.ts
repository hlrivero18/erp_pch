import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PedidoValidator } from './validators/validator';
import { PedidoUtils } from './utils/utils';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [
    PedidosService,
    PedidoUtils,
    PedidoValidator
  ],
  controllers: [PedidosController],
  imports: [PrismaModule]
})
export class PedidosModule {}
