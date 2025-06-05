import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { UserPayload } from 'src/common/types/request-with-user.interface';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);

    const graphqlContext = ctx.getContext<{
      req: { headers: { authorization?: string }; user?: UserPayload };
    }>();
    const request = graphqlContext.req;

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    const payload = this.authService.verifyToken(token);
    request.user = { userId: payload.sub, login: payload.login };
    return true;
  }
}
