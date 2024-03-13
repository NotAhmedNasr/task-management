import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthProviderType, GoogleProfile, LoginFailureReason } from '../types';
import { UserService } from 'src/user/services/user.service';
import { AuthProviderService } from '../services/authProvider.service';
import { LoginHistoryService } from '../services/loginHistory.service';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private authProviderService: AuthProviderService,
    private loginHistoryService: LoginHistoryService,
  ) {
    super({
      clientID: configService.get<string>('googleOauth.clientID'),
      clientSecret: configService.get<string>('googleOauth.clientSecret'),
      callbackURL: `${configService.get<string>('clientUrl')}/oauth2/redirect/google`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ) {
    const authProvider =
      (await this.authProviderService.findByIdentifier(
        AuthProviderType.GOOGLE,
        profile.id,
      )) ??
      this.authProviderService.createLazy(
        AuthProviderType.GOOGLE,
        profile.id,
        profile.emails?.[0]?.value,
      );

    const user =
      authProvider.user ??
      (await this.userService.findByEmail(profile.emails?.[0]?.value)) ??
      (await this.userService.create(
        {
          username: 'googleUser' + profile.id,
          email: profile.emails?.[0]?.value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          password: null,
        },
        AuthProviderType.GOOGLE,
      ));

    if (user.blocked) {
      this.loginHistoryService.log(
        user,
        AuthProviderType.GOOGLE,
        req.ip,
        false,
        LoginFailureReason.BLOCK,
      );
      throw new ForbiddenException('blocked');
    }

    this.loginHistoryService.log(user, AuthProviderType.GOOGLE, req.ip, true);

    if (!authProvider.userId) {
      authProvider.userId = user.id;
    }
    await authProvider.save();

    return user;
  }
}
