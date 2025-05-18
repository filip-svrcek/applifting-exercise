import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      const user = {
        userId: payload.sub,
        login: payload.login,
      };
      (request as RequestWithUser).user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
