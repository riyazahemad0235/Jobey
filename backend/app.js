import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Make sure the database is connected before any route runs
app.use(async (req, res, next) => {
  await connectDb();
  next();
});

app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Express 5 forwards errors from async handlers here
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

export default app;
