import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEventType, RegisterEvent } from 'src/auth/events/events';
import { BoardService } from '../services/board.service';

@Injectable()
export class EventsService {
  constructor(private readonly boardService: BoardService) {}
  @OnEvent(AuthEventType.REGISTER)
  async handleRegisterUser(data: RegisterEvent) {
    this.boardService.createForUser(
      { name: `${data.user.firstName}'s board` },
      data.user,
    );
  }
}
