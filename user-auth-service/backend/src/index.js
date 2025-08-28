// user-auth-service/src/index.js

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Use the .env in this service's folder
import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { DB_NAME } from "./constants.js"; // Make sure this file exists
import authRoutes from "./routes/auth.route.js";

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", authRoutes); // ONLY auth routes are used

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.json({ message: "User-Auth service is running!" });
});

// --- DATABASE ---
const mongoURI = `${process.env.MONGO_URI}/${DB_NAME}`;
connect(mongoURI)
  .then(() => console.log(`User-Auth service connected to MongoDB: ${DB_NAME}`))
  .catch(err => console.error("MongoDB connection error:", err));

// --- SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`User-Auth service running on port ${PORT}`);
});

