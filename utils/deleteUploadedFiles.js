const fs = require("fs");
const path = require("path");

module.exports = function deleteUploadedFiles(files, baseDir) {
  if (!files) return;
  if (!baseDir) return;

  Object.values(files).forEach((fileArray) => {
    fileArray.forEach((file) => {
      const filePath = path.join(baseDir, file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", filePath, err);
      });
    });
  });
};
