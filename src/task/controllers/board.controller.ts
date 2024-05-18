import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BoardService } from '../services/board.service';
import { User } from 'src/auth/decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/:id')
  async getOne(@Param('id') id: string, @User() user: UserAttributes) {
    const board = await this.boardService.getBoardById(id);
    if (!board || !(await this.boardService.isUserAllowed(board, user)))
      throw new NotFoundException(
        "Board is not found or you don't have permission",
      );

    return board;
  }

  @Get('/')
  async getMany(@User() user: UserAttributes) {
    const result = await this.boardService.getAllUserBoards(user);
    return {
      data: result.rows,
      meta: {
        pagination: {
          page: 0,
          pageSize: 0,
          total: result.count,
        },
      },
    };
  }
}
