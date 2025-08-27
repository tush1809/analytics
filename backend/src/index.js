import * as dotenv from "dotenv";
dotenv.config({ path: "./env" });

import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { DB_NAME } from "./constants.js";
import authRoutes from "./routes/auth.route.js";
import predictRoutes from "./routes/predict.route.js";

const app = express();

// ---------- MIDDLEWARE ----------

// Enable CORS with credentials (cookies)
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // frontend URL
  credentials: true                 // allow cookies
}));

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);

// ---------- TEST ROUTE ----------
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// ---------- DATABASE ----------
const mongoURI = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;
connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB: ${DB_NAME}`))
  .catch(err => console.error("MongoDB connection error:", err));

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend origin: ${process.env.CORS_ORIGIN}`);
});

