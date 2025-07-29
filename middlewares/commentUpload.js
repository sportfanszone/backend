const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "images", "comment"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
      file.originalname
    }`;
    cb(null, uniqueName);
  },
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "audios", "comment"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
      file.originalname
    }`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image" && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (file.fieldname === "audio" && file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`));
  }
};

const upload = multer({
  storage: {
    _handleFile: function (req, file, cb) {
      const storage = file.fieldname === "image" ? imageStorage : audioStorage;
      storage._handleFile(req, file, cb);
    },
    _removeFile: function (req, file, cb) {
      const storage = file.fieldname === "image" ? imageStorage : audioStorage;
      storage._removeFile(req, file, cb);
    },
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

const uploadAsync = (req, res) =>
  new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

module.exports = { uploadAsync };
