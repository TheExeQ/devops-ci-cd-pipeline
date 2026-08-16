import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

let databaseAvailable = Boolean(databaseUrl);
let schemaInitialized = false;
let schemaInitializationPromise = null;

console.log("Database configuration:");
console.log(`DATABASE_URL set: ${Boolean(databaseUrl)}`);

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : null;

if (pool) {
  console.log("Database pool created successfully");
} else {
  console.log("No DATABASE_URL provided, database pool not created");
}

function createDatabaseUnavailableError() {
  const error = new Error("Database is unavailable");
  error.code = "DB_UNAVAILABLE";
  return error;
}

function markDatabaseUnavailable() {
  databaseAvailable = false;
  schemaInitialized = false;
}

async function ensureDatabaseSchema() {
  if (!pool) {
    throw createDatabaseUnavailableError();
  }

  if (schemaInitialized) {
    return;
  }

  console.log("Initializing database schema...");

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
        console.log("Database schema initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize database schema:", error.message);
        markDatabaseUnavailable();
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

  try {
    await ensureDatabaseSchema();

    const result = await pool.query(text, params);
    databaseAvailable = true;
    return result;
  } catch (error) {
    console.error("Database query failed:", error.message);
    console.error("Query:", text);
    markDatabaseUnavailable();
    throw error;
  }
}

export async function checkDatabaseAvailability() {
  if (!pool) {
    markDatabaseUnavailable();
    return false;
  }

  try {
    await pool.query("SELECT 1");
    databaseAvailable = true;
    return true;
  } catch {
    console.error("Database availability check failed");
    markDatabaseUnavailable();
    return false;
  }
}

export async function initializeDatabase() {
  if (!pool) {
    markDatabaseUnavailable();
    throw createDatabaseUnavailableError();
  }

  try {
    await ensureDatabaseSchema();
  } catch (error) {
    markDatabaseUnavailable();
    throw error;
  }
}
