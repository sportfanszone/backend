const fs = require("fs").promises;
const path = require("path");

module.exports = async function deleteUploadedFiles(files, baseDir) {
  if (!files || !baseDir) return;

  try {
    let fileArray = [];
    if (Array.isArray(files)) {
      fileArray = files;
    } else {
      fileArray = Object.values(files).flat();
    }

    for (const file of fileArray) {
      const filePath = path.join(baseDir, file.filename);
      await fs.unlink(filePath).catch((err) => {
        console.error("Failed to delete file:", filePath, err);
      });
    }
  } catch (err) {
    console.error("Error in deleteUploadedFiles:", err);
  }
};
