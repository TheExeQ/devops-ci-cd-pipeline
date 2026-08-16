import express from "express";

import { query } from "../db.js";

const booksRouter = express.Router();

export function validateCreateBookPayload(body) {
  const { title, author } = body;

  if (!title || !author) {
    return { error: "title and author are required" };
  }

  return null;
}

booksRouter.get("/", async (req, res) => {
  try {
    console.log("Fetching all books...");
    const result = await query(
      "SELECT id, title, author, published_year, created_at FROM books ORDER BY id ASC",
    );
    console.log(`Found ${result.rows.length} books`);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch books:", error.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

booksRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Fetching book with id: ${id}`);
    const result = await query(
      "SELECT id, title, author, published_year, created_at FROM books WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      console.log(`Book with id ${id} not found`);
      return res.status(404).json({ error: "Book not found" });
    }

    console.log(`Found book: ${result.rows[0].title}`);
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(`Failed to fetch book with id ${id}:`, error.message);
    return res.status(500).json({ error: "Failed to fetch book" });
  }
});

booksRouter.post("/", async (req, res) => {
  const validationError = validateCreateBookPayload(req.body);

  if (validationError) {
    console.log("Validation failed:", validationError.error);
    return res.status(400).json(validationError);
  }

  const { title, author, published_year: publishedYear } = req.body;

  try {
    console.log(`Creating book: "${title}" by ${author}`);
    const result = await query(
      `
        INSERT INTO books (title, author, published_year)
        VALUES ($1, $2, $3)
        RETURNING id, title, author, published_year, created_at
      `,
      [title, author, publishedYear ?? null],
    );

    console.log(`Book created with id: ${result.rows[0].id}`);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`Failed to create book "${title}":`, error.message);
    return res.status(500).json({ error: "Failed to create book" });
  }
});

booksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Deleting book with id: ${id}`);
    const result = await query(
      "DELETE FROM books WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      console.log(`Book with id ${id} not found for deletion`);
      return res.status(404).json({ error: "Book not found" });
    }

    console.log(`Book with id ${id} deleted successfully`);
    return res.status(204).send();
  } catch (error) {
    console.error(`Failed to delete book with id ${id}:`, error.message);
    return res.status(500).json({ error: "Failed to delete book" });
  }
});

export default booksRouter;
