import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { Prediction } from "../models/prediction.model.js";

export const uploadFileAndPredict = async (req, res) => {
  try {
    // Ensure file exists in the request
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Prepare form data for Flask API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path), {
      contentType: "text/csv",
      filename: req.file.originalname,
    });

    // Make request to Flask API
    const flaskResult = await axios.post(
      `${process.env.FLASK_URL}/api/predict`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // SAVE PREDICTION TO DB
    // Extract the current logged in user
    const user = req.user;

    const predictionResult = flaskResult.data.prediction_results
    const insightResult = flaskResult.data.insight_results

    // Create a prediction object
    const predictionObj = {
      user,
      inputFileName: req.file.originalname,
      predictionResult,
      insightResult
    };


    // Save the prediction object to the database
    const newPrediction = new Prediction(predictionObj);
    await newPrediction.save();

    // Delete the uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      } else {
        console.log("file deleted");
        
      }
    });

    // Send Flask response back to the frontend
    res
      .status(201)
      .json({
        message: "New prediction results added",
        results: predictionObj,
      });
  } catch (error) {
    console.error("Error communicating with Flask API:", error.message);
    res.status(500).json({ message: "Error processing file" });
  }
};

export const getLatestPrediction = async (req, res) => {
  try {
    // Extract the current logged in user
    const user = req.user;

    // Find the latest prediction for the user
    const latestPrediction = await Prediction.findOne({ user })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .exec();

    if (!latestPrediction) {
      return res.status(404).json({ message: "No predictions found for the user" });
    }

    // Send the latest prediction back to the frontend
    res.status(200).json({
      message: "Latest prediction retrieved successfully",
      prediction: latestPrediction,
    });
  } catch (error) {
    console.error("Error retrieving latest prediction:", error.message);
    res.status(500).json({ message: "Error retrieving latest prediction" });
  }
}

export const getPredictionHistory = async (req, res) => {
  try {
    // Extract the current logged in user
    const user = req.user;
    // Find all predictions for the user
    const history = await Prediction.find({ user })
      .select("inputFileName createdAt") // Select only the filename and creation date
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .exec();

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No prediction history found for the user" });
    }

    // Send the prediction history back to the frontend
    res.status(200).json({
      message: "Prediction history retrieved successfully",
      history,
    });
  } catch (error) {
    console.error("Error retrieving prediction history:", error.message);
    res.status(500).json({ message: "Error retrieving prediction history" });
  }
}