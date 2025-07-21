const multer = require("multer");
const { League } = require("../../models");

const upload = require("../../middlewares/leagueUpload");
function uploadAsync(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = async (req, res) => {
  try {
    await uploadAsync(req, res);

    console.log(req.body);
    console.log(req.files);

    // Check if name already exists
    const nameExsits = await League.findOne({
      where: { name: req.body.name },
    });
    if (nameExsits) {
      return res.status(400).json({
        status: "error",
        message: "name already in use",
        errors: [{ field: "name", message: "name already in use" }],
      });
    }

    const logo = req.files.logo
      ? `${process.env.BACKEND_URL}/images/league/${req.files.logo[0].filename}`
      : null;
    const backgroundImage = req.files.backgroundImage
      ? `${process.env.BACKEND_URL}/images/league/${req.files.backgroundImage[0].filename}`
      : null;

    // Create league
    const leagueCreated = await League.create({
      name: req.body.name,
      description: req.body.description,
      logo,
      backgroundImage,
    });
    if (!leagueCreated) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create league",
      });
    }
    console.log("League created successfully:", leagueCreated);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in addLeague:", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "error",
          message: "File size too large. Maximum file size is 2MB",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Failed to upload file",
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
