import { validateCreateBookPayload } from "../src/routes/books.js";

describe("validateCreateBookPayload", () => {
  test("accepts a payload with title and author", () => {
    expect(
      validateCreateBookPayload({
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        published_year: 1937,
      }),
    ).toBeNull();
  });

  test("rejects a payload without title", () => {
    expect(
      validateCreateBookPayload({
        author: "J.R.R. Tolkien",
      }),
    ).toEqual({ error: "title and author are required" });
  });

  test("rejects a payload without author", () => {
    expect(
      validateCreateBookPayload({
        title: "The Hobbit",
      }),
    ).toEqual({ error: "title and author are required" });
  });
});
