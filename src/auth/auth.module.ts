import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports:[
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) =>({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '6h'}
      })
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
