import { Request } from 'express';

export function getClientIp(req: Request & { ip: string }): string {
  const forwarded = req.headers['x-forwarded-for'];
  console.log('req.headers', req.headers);
  console.log('req.ip', req.ip);
  console.log('forwarded', forwarded);
  return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip;
}
