export default () => ({
  dbUri: process.env.POSTGRESQL_URL ?? 'postgres://localhost:5432',
});
