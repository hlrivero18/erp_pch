import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

 
  @Post('login')
  async login(@Body() body: any) {
    const mockUser = { userId: 1, username: body.username || 'admin' };
    return this.authService.login(mockUser);
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