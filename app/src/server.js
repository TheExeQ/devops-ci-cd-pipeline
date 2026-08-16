import { createApp } from "./app.js";

console.log("Starting Books API...");
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

const port = process.env.PORT || 3000;

console.log(`Port: ${port}`);
console.log(`Database URL configured: ${Boolean(process.env.DATABASE_URL)}`);

const app = createApp();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log("Books API started successfully");
});
