import { Request } from 'express';

export function getClientIp(req: Request & { ip: string }): string {
  const forwarded = req.headers['x-forwarded-for'];
  return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip;
}
