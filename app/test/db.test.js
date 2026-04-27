import { jest } from "@jest/globals";

const poolQueryMock = jest.fn();

jest.unstable_mockModule("pg", () => ({
  default: {
    Pool: jest.fn(() => ({
      query: poolQueryMock,
    })),
  },
}));

describe("database connection behavior", () => {
  beforeEach(() => {
    jest.resetModules();
    poolQueryMock.mockReset();
    process.env.DATABASE_URL = "postgres://example.com/books";
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
  });

  test("query retries schema initialization after a database failure", async () => {
    poolQueryMock
      .mockRejectedValueOnce(new Error("database down"))
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const { query } = await import("../src/db.js");

    await expect(query("SELECT id FROM books")).rejects.toThrow(
      "database down",
    );
    await expect(query("SELECT id FROM books")).resolves.toEqual({
      rows: [{ id: 1 }],
    });

    expect(poolQueryMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("CREATE TABLE IF NOT EXISTS books"),
    );
    expect(poolQueryMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("CREATE TABLE IF NOT EXISTS books"),
    );
    expect(poolQueryMock).toHaveBeenNthCalledWith(
      3,
      "SELECT id FROM books",
      undefined,
    );
  });

  test("health check marks the database unavailable after a failed ping", async () => {
    poolQueryMock.mockRejectedValueOnce(new Error("database down"));

    const { checkDatabaseAvailability } = await import("../src/db.js");

    await expect(checkDatabaseAvailability()).resolves.toBe(false);
    expect(poolQueryMock).toHaveBeenCalledWith("SELECT 1");
  });
});
