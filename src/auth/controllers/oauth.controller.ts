import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from 'src/types';
import { GoogleAuthGuard } from '../guards/google.guard';

@Controller('oauth2')
export class OAuth2Controller {
  constructor(private readonly authService: AuthService) {}

  // TODO generalize oauth2 for all providers
  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/redirect/google')
  async googleCallback(@Request() req: AuthenticatedRequest) {
    const token = await this.authService.getTokenForUser(req.user);

    return {
      token,
      user: req.user.toJSON(),
    };
  }
}
