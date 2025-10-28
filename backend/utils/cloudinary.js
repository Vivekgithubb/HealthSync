const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (file, folder = "healthsync/documents") => {
  try {
    if (!file || !file.path) throw new Error("No file path found for upload");

    const ext = path.extname(file.originalname || "").toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    // Determine resource type - PDFs and documents should be 'raw'
    const resourceType = imageExtensions.includes(ext) ? "image" : "raw";

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Build download URL based on resource type
    let downloadUrl;
    if (resourceType === "raw") {
      // For raw files (PDFs, docs), add fl_attachment as a query parameter
      downloadUrl = `${result.secure_url}?fl_attachment`;
    } else {
      // For images, use the transformation in the path
      downloadUrl = result.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
    }

    // Extract format from file extension if not provided by Cloudinary
    const format =
      result.format ||
      ext.replace(".", "") ||
      path.extname(file.originalname).slice(1).toLowerCase();

    return {
      url: result.secure_url,
      downloadUrl,
      publicId: result.public_id,
      format: format,
      size: result.bytes,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
