import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(__dirname, '../database/database.sqlite');

const sqliteConfig = {
  dialect: 'sqlite',
  storage: databasePath,
};

const postgresConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'unittcms',
  username: process.env.DB_USER || 'unittcms',
  password: process.env.DB_PASSWORD || 'unittcms',
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Postgres is used when DB_DIALECT=postgres or when DB_HOST is set;
// otherwise fall back to the bundled SQLite database.
const dialect = process.env.DB_DIALECT || (process.env.DB_HOST ? 'postgres' : 'sqlite');
const activeConfig = dialect === 'postgres' ? postgresConfig : sqliteConfig;

export default {
  development: activeConfig,
  test: sqliteConfig,
  production: activeConfig,
};
