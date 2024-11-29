require("dotenv").config();
const express = require("express");
const {
  validateSchoolInput,
  validateCoordinates,
} = require("./src/middleware/validation");
const { addSchool, listSchools } = require("./src/services/schoolService");

const app = express();
app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.post("/addSchool", validateSchoolInput, async (req, res) => {
  try {
    const school = await addSchool(req.body);
    res.status(201).json({
      message: "School added successfully",
      school,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ error: "Failed to add school" });
  }
});

app.get("/listSchools", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const schools = await listSchools(Number(latitude), Number(longitude));
    res.json(schools);
  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
