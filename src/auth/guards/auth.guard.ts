import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const payload = this.authService.verifyToken(token);
    const user = {
      userId: payload.sub,
      login: payload.login,
    };
    (request as RequestWithUser).user = user;
    return true;
  }
}
