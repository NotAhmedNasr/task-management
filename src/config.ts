export default () => ({
  host: process.env.HOST ?? 'http://localhost',
  port: process.env.PORT ?? 3000,
  domain: process.env.domain ?? 'http://localhost:3000',
  dbUri: process.env.POSTGRESQL_URL ?? 'postgres://localhost:5432',
  nodeEnv: process.env.NODE_ENV ?? 'production',
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  smtp: {
    host: process.env.MAIL_PROVIDER_HOST,
    port: process.env.MAIL_PROVIDER_PORT,
    username: process.env.MAIL_PROVIDER_USERNAME,
    password: process.env.MAIL_PROVIDER_PASSWORD,
    from: process.env.MAIL_PROVIDER_FROM,
  },
  googleOauth: {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  },
  clientUrl: process.env.CLIENT_URL,
});
