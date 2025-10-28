const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

// Error handler middleware
const handleError = (err, res) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ error: message });
};

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for memory storage (for AI analysis)
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});
// Configure multer for disk storage (used by legacy parse-prescription)
const diskUpload = multer({
  dest: uploadDir,
  limits: { fileSize: 15 * 1024 * 1024 },
});
// AI prescription analysis endpoint
const { analyzePrescription } = require("../controllers/pharmacyController");
router.post(
  "/analyze",
  protect,
  memoryUpload.single("file"),
  async (req, res) => {
    try {
      await analyzePrescription(req, res);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// @route   POST /api/pharmacy/parse-prescription
// @desc    Parse prescription image using Gemini AI
// @access  Private
router.post(
  "/parse-prescription",
  protect,
  diskUpload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      // Read the image file
      const imageData = fs.readFileSync(req.file.path);
      const base64Image = imageData.toString("base64");

      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a medical prescription analyzer. Analyze this prescription image and extract ALL medication/drug names you can see.
Return ONLY a valid JSON array of medication names with no additional text, markdown, or explanation.
Format: ["medication1", "medication2", "medication3"]
If you cannot see any medications clearly, return an empty array: []
Include both generic and brand names if visible.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image,
          },
        },
      ]);

      const response = await result.response;
      let text = response.text();

      // Clean up the response to get just the JSON array
      text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // Remove any surrounding text and extract just the JSON array
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        text = jsonMatch[0];
      }

      let medications = [];
      try {
        medications = JSON.parse(text);
        if (!Array.isArray(medications)) {
          medications = [];
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);
        console.log("Raw AI Response:", text);
        // If JSON parsing fails, try to extract medication names from text
        const lines = text.split(/[\n,]/).filter((line) => line.trim());
        medications = lines
          .map((line) =>
            line
              .replace(/^[-*•"\[\]\d.\s]+/, "")
              .replace(/["\[\]]/g, "")
              .trim()
          )
          .filter((med) => med.length > 0 && med.length < 50); // Filter out empty and suspiciously long strings
      }

      // Clean up temp file
      fs.unlinkSync(req.file.path);

      res.json({ medications });
    } catch (error) {
      // Clean up temp file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Gemini AI Error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Error parsing prescription";
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing Gemini API key";
      } else if (error.message.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later.";
      }

      res.status(500).json({ message: errorMessage, error: error.message });
    }
  }
);

// @route   GET /api/pharmacy/search/:drugName
// @desc    Search drug information using OpenFDA API
// @access  Private
router.get("/search/:drugName", protect, async (req, res) => {
  try {
    const { drugName } = req.params;

    // OpenFDA API endpoint - search both brand and generic names with OR logic
    const searchTerm = encodeURIComponent(drugName);
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${searchTerm}+OR+openfda.generic_name:${searchTerm})&limit=5`;

    const response = await axios.get(fdaUrl);

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ message: "No drug information found" });
    }

    // Parse and format the results
    const drugInfo = response.data.results.map((drug) => ({
      brandName: drug.openfda?.brand_name?.[0] || "N/A",
      genericName: drug.openfda?.generic_name?.[0] || "N/A",
      manufacturer: drug.openfda?.manufacturer_name?.[0] || "N/A",
      purpose: drug.purpose?.[0] || drug.indications_and_usage?.[0] || "N/A",
      dosage: drug.dosage_and_administration?.[0] || "N/A",
      warnings: drug.warnings?.[0] || drug.boxed_warning?.[0] || "N/A",
      sideEffects: drug.adverse_reactions?.[0] || "N/A",
      activeIngredients: drug.active_ingredient?.[0] || "N/A",
      productType: drug.openfda?.product_type?.[0] || "N/A",
      route: drug.openfda?.route?.[0] || "N/A",
    }));

    res.json({
      query: drugName,
      results: drugInfo,
    });
  } catch (error) {
    console.error("OpenFDA API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      query: drugName,
    });

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: `Drug "${drugName}" not found in FDA database. Try a different spelling or generic name.`,
      });
    }

    res.status(500).json({
      message: "Error searching drug information",
      error: error.message,
    });
  }
});

// @route   GET /api/pharmacy/alternatives/:drugName
// @desc    Get drug alternatives
// @access  Private
router.get("/alternatives/:drugName", protect, async (req, res) => {
  try {
    const { drugName } = req.params;

    // First, get the generic name
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drugName}"&limit=1`;
    const response = await axios.get(fdaUrl);

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const genericName = response.data.results[0].openfda?.generic_name?.[0];

    if (!genericName) {
      return res.json({ alternatives: [], message: "No generic name found" });
    }

    // Search for alternatives with the same generic name
    const altUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${genericName}"&limit=10`;
    const altResponse = await axios.get(altUrl);

    const alternatives = altResponse.data.results.map((drug) => ({
      brandName: drug.openfda?.brand_name?.[0] || "N/A",
      genericName: drug.openfda?.generic_name?.[0] || "N/A",
      manufacturer: drug.openfda?.manufacturer_name?.[0] || "N/A",
      route: drug.openfda?.route?.[0] || "N/A",
    }));

    res.json({
      originalDrug: drugName,
      genericName,
      alternatives,
    });
  } catch (error) {
    console.error("OpenFDA API Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error finding alternatives",
      error: error.message,
    });
  }
});

module.exports = router;
