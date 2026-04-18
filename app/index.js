import express from "express";

import {
  checkDatabaseAvailability,
  initializeDatabase,
} from "./db.js";
import booksRouter from "./routes/books.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  const databaseAvailable = await checkDatabaseAvailability();

  res.status(databaseAvailable ? 200 : 503).json({
    message: "Books API is running",
    database: databaseAvailable ? "available" : "unavailable",
  });
});

app.use("/books", booksRouter);

initializeDatabase()
  .catch((error) => {
    console.error("Failed to initialize database", error);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  });
