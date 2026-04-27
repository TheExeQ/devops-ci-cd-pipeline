import { buildHealthResponse } from "../src/app.js";

describe("buildHealthResponse", () => {
  test("returns an available database status", () => {
    expect(buildHealthResponse(true)).toEqual({
      message: "Books API is running",
      database: "available",
    });
  });

  test("returns an unavailable database status", () => {
    expect(buildHealthResponse(false)).toEqual({
      message: "Books API is running",
      database: "unavailable",
    });
  });
});
