import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AlreadyVotedError } from '../errors/already-voted.error';
import { Response } from 'express';

@Catch(AlreadyVotedError)
export class AlreadyVotedFilter implements ExceptionFilter {
  catch(exception: AlreadyVotedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    return res.status(409).json({
      error: exception.name,
      message: exception.message,
    });
  }
}
