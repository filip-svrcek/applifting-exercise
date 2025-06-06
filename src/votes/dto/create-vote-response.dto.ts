import { CreateVoteDto } from './create-vote.dto';

export interface CreateVoteResponseDto extends CreateVoteDto {
  id: number;
  ipAddress: string;
}
