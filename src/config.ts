export default () => ({
  dbUri: process.env.POSTGRESQL_URL ?? 'postgres://localhost:5432',
  nodeEnv: process.env.NODE_ENV ?? 'production',
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
});
