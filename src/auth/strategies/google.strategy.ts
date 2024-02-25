import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthProviderType, GoogleProfile } from '../types';
import { UserService } from 'src/user/services/user.service';
import { AuthProviderService } from '../services/authProvider.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private authProviderService: AuthProviderService,
  ) {
    super({
      clientID: configService.get<string>('googleOauth.clientID'),
      clientSecret: configService.get<string>('googleOauth.clientSecret'),
      callbackURL: `${configService.get<string>('clientUrl')}/oauth2/redirect/google`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
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

    if (!authProvider.userId) {
      authProvider.userId = user.id;
    }
    authProvider.lastLoginAt = new Date();
    await authProvider.save();

    return user;
  }
}
