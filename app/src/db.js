import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

let databaseAvailable = Boolean(databaseUrl);
let schemaInitialized = false;
let schemaInitializationPromise = null;

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : null;

function createDatabaseUnavailableError() {
  const error = new Error("Database is unavailable");
  error.code = "DB_UNAVAILABLE";
  return error;
}

async function ensureDatabaseSchema() {
  if (!pool) {
    throw createDatabaseUnavailableError();
  }

  if (schemaInitialized) {
    return;
  }

  if (!schemaInitializationPromise) {
    schemaInitializationPromise = pool
      .query(
        `
        CREATE TABLE IF NOT EXISTS books (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          published_year INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
      )
      .then(() => {
        databaseAvailable = true;
        schemaInitialized = true;
      })
      .catch((error) => {
        databaseAvailable = false;
        throw error;
      })
      .finally(() => {
        schemaInitializationPromise = null;
      });
  }

  await schemaInitializationPromise;
}

export async function query(text, params) {
  if (!pool) {
    throw createDatabaseUnavailableError();
  }

  await ensureDatabaseSchema();

  const result = await pool.query(text, params);
  databaseAvailable = true;
  return result;
}

export async function checkDatabaseAvailability() {
  if (!pool) {
    databaseAvailable = false;
    return false;
  }

  try {
    await pool.query("SELECT 1");
    databaseAvailable = true;
    return true;
  } catch {
    databaseAvailable = false;
    return false;
  }
}

export async function initializeDatabase() {
  if (!pool) {
    databaseAvailable = false;
    throw createDatabaseUnavailableError();
  }

  try {
    await ensureDatabaseSchema();
  } catch (error) {
    databaseAvailable = false;
    throw error;
  }
}
