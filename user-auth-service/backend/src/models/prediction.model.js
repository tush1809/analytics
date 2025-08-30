import { Schema, model } from "mongoose";

const PredictionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  inputFileName: { type: String, required: true },
  predictionResult: { type: Object, required: true },
  insightResult: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Prediction = model("Prediction", PredictionSchema);
