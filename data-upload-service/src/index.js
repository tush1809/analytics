// data-upload-service/src/index.js

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";
import multer from "multer"; // For handling file uploads
import axios from "axios";    // For calling the other service
import fs from "fs";          // For reading the uploaded file
import { parse } from "csv-parse"; // For parsing the CSV content

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporarily store uploads

// --- MIDDLEWARE ---
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// --- ROUTES ---
// This is the only route in this service
app.post("/api/upload", upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file was uploaded.' });
    }

    const filePath = req.file.path;
    try {
        const records = [];
        // Create a readable stream and pipe it to the CSV parser
        const parser = fs.createReadStream(filePath)
            .pipe(parse({
                columns: true, // Use the first row as headers
                skip_empty_lines: true
            }));

        // Process the stream
        for await (const record of parser) {
            records.push(record);
        }

        // Call the Analytics Service with the parsed JSON data
        const analyticsResponse = await axios.post(
            process.env.ANALYTICS_SERVICE_URL, // e.g., http://localhost:5001/api/analyze
            records,
            { headers: { 'Content-Type': 'application/json' } }
        );

        // Send the final result from the analytics service back to the frontend
        res.status(200).json(analyticsResponse.data);

    } catch (error) {
        console.error("Error processing file or calling analytics service:", error.message);
        const errMessage = error.response ? error.response.data.message : "An internal server error occurred.";
        const errStatus = error.response ? error.response.status : 500;
        return res.status(errStatus).json({ message: errMessage });
    } finally {
        // IMPORTANT: Clean up the temporary file after processing
        fs.unlinkSync(filePath);
    }
});

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.json({ message: "Data-Upload service is running!" });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// --- SERVER ---
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Data-Upload service running on port ${PORT}`);
});

