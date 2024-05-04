import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LoginHistoryService } from '../services/loginHistory.service';
import { GetHistoryDTO } from '../dto/getHistory.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';

@Controller('log')
@UseGuards(JwtAuthGuard)
export class LogController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Get('/loginHistory')
  async getLoginHistory(
    @Query(new ValidationPipe({ transform: true })) query: GetHistoryDTO,
    @User() user: UserAttributes,
  ) {
    const data = await this.loginHistoryService.get({
      user,
      page: query.page,
      pageSize: query.pageSize,
    });

    return {
      data: data.rows,
      meta: {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          total: data.count,
        },
      },
    };
  }
}
