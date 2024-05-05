import { UserAttributes } from 'src/user/models/userAttributes.model';
import { AuthProviderType, LoginFailureReason } from '../types';
import { EventEmitter2 } from '@nestjs/event-emitter';

export enum AuthEventType {
  LOGIN = 'auth.login',
  FAILED_LOGIN = 'auth.failedLogin',
  REGISTER = 'auth.register',
  LINK_ACCOUNT = 'auth.linkAccount',
}

export class LoginEvent {
  constructor(
    public user: UserAttributes,
    public loginType: AuthProviderType,
    public address: string,
    public agent: string,
  ) {}

  public success = true;
  publish(emitter: EventEmitter2) {
    emitter.emit(AuthEventType.LOGIN, this);
  }
}

export class FailedLoginEvent extends LoginEvent {
  constructor(
    public user: UserAttributes,
    public loginType: AuthProviderType,
    public address: string,
    public agent: string,
    public failureReason: LoginFailureReason,
  ) {
    super(user, loginType, address, agent);
    this.success = false;
  }

  publish(emitter: EventEmitter2) {
    emitter.emit(AuthEventType.FAILED_LOGIN, this);
  }
}

export class RegisterEvent {
  constructor(
    public user: UserAttributes,
    public type: AuthProviderType,
  ) {}

  publish(emitter: EventEmitter2) {
    emitter.emit(AuthEventType.REGISTER, this);
  }
}

export class LinkAccountEvent {
  constructor(public user: UserAttributes) {}

  publish(emitter: EventEmitter2) {
    emitter.emit(AuthEventType.LINK_ACCOUNT, this);
  }
}
