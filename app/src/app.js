import express from "express";

import { checkDatabaseAvailability } from "./db.js";
import booksRouter from "./routes/books.js";

export function buildHealthResponse(databaseAvailable) {
  return {
    message: "Books API is running",
    database: databaseAvailable ? "available" : "unavailable",
  };
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", async (req, res) => {
    const databaseAvailable = await checkDatabaseAvailability();

    res.status(databaseAvailable ? 200 : 503).json(
      buildHealthResponse(databaseAvailable),
    );
  });

  app.use("/books", booksRouter);

  return app;
}
