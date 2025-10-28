const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document");
const { protect } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// @desc    Upload document to Cloudinary
// @access  Private
// @route   POST /api/documents/upload
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cloudinaryResult = await uploadToCloudinary(
      req.file,
      "healthsync/documents"
    );
    console.log("Cloudinary upload result:", cloudinaryResult);

    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      type: req.body.type || "other",
      description: req.body.description || "",
      fileUrl: cloudinaryResult.url,
      downloadUrl: cloudinaryResult.downloadUrl, // This now has fl_attachment
      publicId: cloudinaryResult.publicId,
      fileType: cloudinaryResult.format || req.file.mimetype,
      fileSize: cloudinaryResult.size,
      user: req.user._id,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// @route   GET /api/documents
// @desc    Get all documents for current user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({
      uploadDate: -1,
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/documents/:id
// @desc    Get single document
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document metadata
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Update allowed fields
    if (req.body.title) document.title = req.body.title;
    if (req.body.type) document.type = req.body.type;
    if (req.body.description) document.description = req.body.description;
    if (req.body.tags) document.tags = req.body.tags;

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(document.publicId);

    // Delete from database
    await document.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
