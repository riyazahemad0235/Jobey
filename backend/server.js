import "dotenv/config"; // must be first so env vars exist for everything below
import app from "./app.js";
import connectDb from "./config/db.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to your .env file.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

try {
  await connectDb();
} catch (error) {
  console.error("The Connection failed:", error.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`The app is running on ${PORT}`);
});
