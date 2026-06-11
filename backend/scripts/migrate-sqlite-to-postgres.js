/**
 * One-time data migration: copies all rows from the legacy SQLite database
 * into Postgres, preserving primary keys, then resets Postgres sequences.
 *
 * Prerequisites:
 *   1. Postgres is reachable via DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
 *   2. The Postgres schema is already created: `npx sequelize-cli db:migrate`
 *   3. The Postgres tables are empty (the script aborts otherwise)
 *
 * Usage:
 *   node scripts/migrate-sqlite-to-postgres.js [path/to/database.sqlite]
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, QueryTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlitePath = process.argv[2] || path.resolve(__dirname, '../database/database.sqlite');

// Insertion order respects foreign key dependencies
const TABLES = [
  'users',
  'projects',
  'folders',
  'runs',
  'cases',
  'steps',
  'caseSteps',
  'attachments',
  'caseAttachments',
  'runCases',
  'members',
  'tags',
  'caseTags',
  'comments',
];

const sqlite = new Sequelize({ dialect: 'sqlite', storage: sqlitePath, logging: false });

const postgres = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'unittcms',
  username: process.env.DB_USER || 'unittcms',
  password: process.env.DB_PASSWORD || 'unittcms',
  logging: false,
});

async function getBooleanColumns(table) {
  const rows = await postgres.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_name = :table AND data_type = 'boolean'`,
    { replacements: { table }, type: QueryTypes.SELECT }
  );
  return rows.map((row) => row.column_name);
}

async function copyTable(table, transaction) {
  const rows = await sqlite.query(`SELECT * FROM "${table}"`, { type: QueryTypes.SELECT });
  if (rows.length === 0) {
    console.log(`  ${table}: empty, skipped`);
    return;
  }

  const booleanColumns = await getBooleanColumns(table);
  const converted = rows.map((row) => {
    const result = { ...row };
    for (const column of booleanColumns) {
      if (result[column] !== null && result[column] !== undefined) {
        result[column] = Boolean(result[column]);
      }
    }
    return result;
  });

  await postgres.getQueryInterface().bulkInsert(table, converted, { transaction });
  console.log(`  ${table}: ${rows.length} rows copied`);
}

async function resetSequence(table) {
  // Tables use Sequelize's auto-increment "id" primary key
  const [result] = await postgres.query(`SELECT pg_get_serial_sequence('"${table}"', 'id') AS seq`, {
    type: QueryTypes.SELECT,
  });
  if (!result?.seq) return;
  await postgres.query(`SELECT setval('${result.seq}', COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false)`);
}

async function assertPostgresEmpty() {
  for (const table of TABLES) {
    const [{ count }] = await postgres.query(`SELECT COUNT(*) AS count FROM "${table}"`, {
      type: QueryTypes.SELECT,
    });
    if (Number(count) > 0) {
      throw new Error(`Postgres table "${table}" is not empty. Aborting to avoid duplicate data.`);
    }
  }
}

async function main() {
  console.log(`Source SQLite: ${sqlitePath}`);
  console.log(`Target Postgres: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);

  await sqlite.authenticate();
  await postgres.authenticate();
  await assertPostgresEmpty();

  // Single transaction: a failure leaves Postgres empty instead of partially copied
  console.log('Copying tables...');
  const transaction = await postgres.transaction();
  try {
    for (const table of TABLES) {
      await copyTable(table, transaction);
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  console.log('Resetting sequences...');
  for (const table of TABLES) {
    await resetSequence(table);
  }

  console.log('Done. SQLite data migrated to Postgres.');
}

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlite.close();
    await postgres.close();
  });
