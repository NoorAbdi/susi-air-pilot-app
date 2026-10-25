import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(username: string, pass: string) {
    if (username === 'budiluhur' && pass === 'susiairtest') {
      const payload = { sub: 1, username: 'budiluhur' };
      return {
        token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}