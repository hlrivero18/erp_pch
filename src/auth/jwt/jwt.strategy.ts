import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MI_CLAVE_SECRETA_SUPER_SEGURA', // Debe coincidir con la del AuthModule
    });
  }

  // Si el token es válido, Passport extrae el payload y lo pasa a este método
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}