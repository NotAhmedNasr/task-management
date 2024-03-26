import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthProviderType, GoogleProfile, LoginFailureReason } from '../types';
import { UserService } from 'src/user/services/user.service';
import { AuthProviderService } from '../services/authProvider.service';
import { FailedLoginEvent, LoginEvent, RegisterEvent } from '../events/events';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private authProviderService: AuthProviderService,
    private emitter: EventEmitter2,
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
      (await this.userService
        .create({
          username: 'googleUser' + profile.id,
          email: profile.emails?.[0]?.value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          password: null,
          confirmationToken: null,
        })
        .then((data) => {
          new RegisterEvent(data, AuthProviderType.GOOGLE).publish(
            this.emitter,
          );
          return data;
        }));

    if (user.blocked) {
      new FailedLoginEvent(
        user,
        AuthProviderType.GOOGLE,
        req.ip,
        req.header('user-agent'),
        LoginFailureReason.BLOCK,
      ).publish(this.emitter);
      throw new ForbiddenException('blocked');
    }

    new LoginEvent(
      user,
      AuthProviderType.GOOGLE,
      req.ip,
      req.get('user-agent'),
    ).publish(this.emitter);

    if (!authProvider.userId) {
      authProvider.userId = user.id;
    }
    await authProvider.save();

    return user;
  }
}
