const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (file, folder = "healthsync/documents") => {
  try {
    if (!file || !file.path) {
      throw new Error("No file path found for upload");
    }

    // Detect file type properly
    const ext = path.extname(file.originalname || "").toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const resourceType = imageExtensions.includes(ext) ? "image" : "raw";

    console.log("📤 Uploading file:", file.originalname, "as", resourceType);

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType, // this ensures PDFs & docs go to /raw/upload/
    });

    console.log("✅ Upload successful:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      resourceType,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);
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
