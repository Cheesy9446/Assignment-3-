// models/Workout.js
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },          // exercise name
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number },                        // optional
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workout", workoutSchema);
