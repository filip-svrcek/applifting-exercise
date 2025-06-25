export class AlreadyVotedError extends Error {
  constructor() {
    super(`You have already voted on this comment`);
    this.name = 'AlreadyVotedError';
  }
}
