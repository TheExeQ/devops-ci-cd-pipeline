import express from "express";

import { pool } from "../db.js";

const booksRouter = express.Router();

booksRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, author, published_year, created_at FROM books ORDER BY id ASC",
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch books", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

booksRouter.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, author, published_year, created_at FROM books WHERE id = $1",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch book", error);
    return res.status(500).json({ error: "Failed to fetch book" });
  }
});

booksRouter.post("/", async (req, res) => {
  const { title, author, published_year: publishedYear } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO books (title, author, published_year)
        VALUES ($1, $2, $3)
        RETURNING id, title, author, published_year, created_at
      `,
      [title, author, publishedYear ?? null],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create book", error);
    return res.status(500).json({ error: "Failed to create book" });
  }
});

booksRouter.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING id",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete book", error);
    return res.status(500).json({ error: "Failed to delete book" });
  }
});

export default booksRouter;
