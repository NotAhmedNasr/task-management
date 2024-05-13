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

  async getAllUserBoards(user: UserAttributes) {
    return this.boardModel.findAndCountAll({
      where: {
        createdById: user.id,
      },
    });
  }

  async isUserAllowed(board: Board, user: UserAttributes): Promise<boolean>;
  async isUserAllowed(boardId: string, user: UserAttributes): Promise<boolean>;
  async isUserAllowed(boardOrId: string | Board, user: UserAttributes) {
    if (typeof boardOrId === 'string') {
      boardOrId = await this.boardModel.findOne({
        where: {
          id: boardOrId,
          createdById: user.id,
        },
        attributes: ['id'],
      });
    }
    return boardOrId.createdById === user.id;
  }

  async getBoardById(boardId: string) {
    return this.boardModel.findOne({
      where: {
        id: boardId,
      },
    });
  }
}
