import { Field, ObjectType } from '@nestjs/graphql';
import { CreateVoteDto } from './create-vote.dto';

@ObjectType()
export class CreateVoteResponseDto extends CreateVoteDto {
  @Field()
  id: number;
  @Field()
  ipAddress: string;
}
