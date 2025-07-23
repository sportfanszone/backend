const fs = require("fs");
const path = require("path");
const url = require("url");

function deleteUserImageIfLocal(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;

  try {
    const parsed = url.parse(imageUrl);
    const fileName = path.basename(parsed.pathname || "");

    // Check if the URL belongs to your server (localhost or production)
    const isOwnDomain =
      imageUrl.startsWith(process.env.BACKEND_URL) ||
      parsed.pathname?.startsWith("/images/user");

    if (!isOwnDomain) return; // Skip deleting remote images (e.g. Google, Cloudinary)

    const imagePath = path.join(
      process.cwd(),
      "public",
      "images",
      "user",
      fileName
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`✅ Deleted image: ${imagePath}`);
    } else {
      console.log(`⚠️ Image not found: ${imagePath}`);
    }
  } catch (err) {
    console.error("❌ Error deleting image:", err.message);
  }
}

module.exports = deleteUserImageIfLocal;
