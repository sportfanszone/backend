const fs = require("fs");
const path = require("path");

module.exports = function deleteUploadedFiles(files, filePath) {
  if (!files) return;

  Object.values(files).forEach((fileArray) => {
    fileArray.forEach((file) => {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "league",
        file.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", filePath, err);
      });
    });
  });
};
