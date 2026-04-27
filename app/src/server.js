import { initializeDatabase } from "./db.js";
import { createApp } from "./app.js";

const app = createApp();
const port = process.env.PORT || 3000;

initializeDatabase().catch((error) => {
  console.error("Failed to initialize database", error);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
