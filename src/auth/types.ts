export interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: {
    value: string;
    verified: boolean;
  }[];
  photos: {
    value: string;
  }[];
  provider: string;
}

export enum AuthProviderType {
  GOOGLE = 'google',
  LOCAL = 'local',
}
