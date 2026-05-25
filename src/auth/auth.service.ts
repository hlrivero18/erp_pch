import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register/register.dto';
import { LoginDto } from './dto/login/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService
    ) { }

    async register(body: RegisterDto) {

        const existing = await this.prismaService.user.findUnique({
            where: { email: body.email },
        });

        if (existing) {
            throw new ConflictException('El email ya está registrado');
        }

        const hashedPass = await bcrypt.hash(body.password, 10);

        const newUser = await this.prismaService.user.create({
            data: {
                email: body.email,
                password: hashedPass,
                name: body.name,
                lastName: body.lastName
            }
        });

        const token = this.jwtService.sign({
            sub: newUser.id,
            email: newUser.email
        });

        return {
            token,
            user: { name: newUser.name, email: newUser.email },
        };

    }

    async login(body: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: body.email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        console.log("desde servicio: " + token)

        return { id: user.id, token };
    }
}
