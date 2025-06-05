import { Request } from 'express';

export interface UserPayload {
  userId: number;
  login: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
