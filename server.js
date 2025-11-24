// Envioronment variable
require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Workout = require("./models/addworkout");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Main home route
app.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 }).limit(10).lean();
    res.render("index", { workouts });
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.render("index", { workouts: [] });
  }
});

// Adding workout route
app.get("/workouts/add", (req, res) => {
  res.render("addworkout", { title: "Add Workout" });
});

// Adding workout handler
app.post("/workouts/add", async (req, res) => {
  try {
    const { name, sets, reps, weight, date } = req.body;

    await Workout.create({
      name,
      sets,
      reps,
      weight,
      date: date || Date.now(),
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error saving workout:", err);
    res.status(500).send("Server error saving workout");
  }
});

// Editing workout route
app.get("/workouts/:id/edit", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).lean();
    if (!workout) {
      return res.status(404).send("Workout not found");
    }
    res.render("edit", { title: "Edit Workout", workout });
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(500).send("Server error loading edit page");
  }
});

// Editing workout handler
app.post("/workouts/:id/edit", async (req, res) => {
  try {
    const { name, sets, reps, weight, date } = req.body;

    await Workout.findByIdAndUpdate(req.params.id, {
      name,
      sets,
      reps,
      weight,
      date: date || Date.now(),
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error updating workout:", err);
    res.status(500).send("Server error updating workout");
  }
});

// Delete workout handler
app.post("/workouts/:id/delete", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).send("Server error deleting workout");
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
