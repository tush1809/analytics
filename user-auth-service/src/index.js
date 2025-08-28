import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { DB_NAME } from "./constants.js";
import authRoutes from "./routes/auth.route.js";

// --- DOTENV CONFIGURATION ---
// This is the correct way to get the directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to find the .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });


// --- EXPRESS APP SETUP ---
const app = express();


// --- MIDDLEWARE ---
// Enable CORS with credentials (cookies)
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // Your frontend URL from .env
  credentials: true                 // Allow cookies
}));

// Parse cookies from incoming requests
app.use(cookieParser());
// Parse JSON bodies from incoming requests
app.use(express.json());


// --- ROUTES ---
app.use("/api/auth", authRoutes);


// --- TEST ROUTE ---
// A simple route to confirm the service is running
app.get("/", (req, res) => {
  res.json({ message: "User-Auth service is running!" });
});


// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(`${mongoURI}/${DB_NAME}`)
  .then(() => {
    console.log(`User-Auth service connected to MongoDB: ${DB_NAME}`);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    // Exit the process with an error code if the database connection fails
    process.exit(1); 
  });


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend origin: ${process.env.CORS_ORIGIN}`);
});

