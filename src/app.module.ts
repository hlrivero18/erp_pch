import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    MenuItemsModule,
    PedidosModule,
    ReportesModule,
  ],
})
export class AppModule {}