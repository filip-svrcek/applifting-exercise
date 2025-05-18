import { CreateVoteDto } from '../dto/create-vote.dto';

export interface CreateVoteInput extends CreateVoteDto {
  ipAddress: string;
}
