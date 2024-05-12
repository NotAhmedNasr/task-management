import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Board, BoardAttributes } from '../models/board.model';
import { UserAttributes } from 'src/user/models/userAttributes.model';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Board) private readonly boardModel: typeof Board) {}
  async createForUser(
    attrs: Pick<BoardAttributes, 'name'>,
    user: UserAttributes,
  ) {
    return this.boardModel.create({
      name: attrs.name,
      createdById: user.id,
    });
  }

  async getUserPersonalBoard(user: UserAttributes) {
    return this.boardModel.findOne({
      where: {
        createdById: user.id,
        personal: true,
      },
    });
  }

  async isUserAllowed(boardId: string, user: UserAttributes) {
    const board = await this.boardModel.findOne({
      where: {
        id: boardId,
        createdById: user.id,
      },
    });

    return !!board;
  }
}
