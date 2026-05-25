import { Controller, Post, Body, Get, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RegisterDto } from './dto/register/register.dto';
import { SuccessResponse } from '../common/responses/success.response';
import { LoginDto } from './dto/login/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: RegisterDto
  ){
    const data = await this.authService.register(body)
    return new SuccessResponse('usuario creado con exito', data, 201)
  }
 
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginDto
  ) {
    const data = await this.authService.login(body)
    console.log("desde controller: " + data)
    return new SuccessResponse("Usuario logueado con exito", data, 200)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: '¡Tienes acceso a esta ruta protegida!',
      user: req.user
    };
  }
}