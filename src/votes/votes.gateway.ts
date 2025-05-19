import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { VotesService } from 'src/votes/votes.service';
import { CreateVoteDto } from 'src/votes/dto/create-vote.dto';
import { validateOrReject } from 'class-validator';

@WebSocketGateway({
  namespace: '/votes',
  cors: {
    origin: '*',
  },
})
export class VotesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly votesService: VotesService,
    private readonly authService: AuthService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.query?.token as string;

    if (!token) {
      console.error('No token provided');
      client.disconnect();
      throw new WsException('Unauthorized');
    }
    try {
      this.authService.verifyToken(token);
      console.log('Client connected:', client.id);
    } catch (error) {
      console.error('Unauthorized connection attempt:', error);
      client.disconnect();
      throw new WsException('Unauthorized');
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('voteComment')
  async handleVoteComment(@MessageBody() dto: CreateVoteDto, @ConnectedSocket() client: Socket) {
    try {
      await validateOrReject(Object.assign(new CreateVoteDto(), dto));
    } catch (error) {
      console.error('Validation error:', error);
      throw new WsException('Invalid data');
    }
    const ipAddress =
      client.handshake.headers['x-forwarded-for']?.toString().split(',')[0] ||
      client.handshake.address;

    try {
      const createdVote = await this.votesService.create({
        ...dto,
        ipAddress,
      });

      const { commentId, isUpvote } = createdVote;

      this.server.emit('commentVoted', { commentId, isUpvote });
    } catch {
      throw new WsException('You cannot vote for this comment');
    }
  }
}
