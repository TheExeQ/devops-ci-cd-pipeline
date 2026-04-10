import express from "express";

import { initializeDatabase } from "./db.js";
import booksRouter from "./routes/books.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Books API is running" });
});

app.use("/books", booksRouter);

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
