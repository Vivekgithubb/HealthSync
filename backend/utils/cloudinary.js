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
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const resourceType = imageExtensions.includes(ext) ? "image" : "raw";

    // Create a timestamp and generate signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      type: "authenticated",
      access_mode: "authenticated",
      timestamp: timestamp,
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    console.log("✅ Upload successful:", {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    });

    // Build a download URL that forces attachment:
    // e.g. https://res.cloudinary.com/<cloud>/<resource_type>/upload/fl_attachment/v123/.../file.pdf
    const downloadUrl = result.secure_url.replace(
      "/upload/",
      `/upload/fl_attachment/`
    );

    return {
      url: result.secure_url,
      downloadUrl,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      resourceType: result.resource_type || resourceType,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary };
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
