const path = require("path");
const multer = require("multer");
const { Club } = require("../../models");
const { uploadAsync } = require("../../middlewares/clubUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

module.exports = async (req, res) => {
  const filePath = path.join(process.cwd(), "public", "images", "club");
  try {
    // Upload files
    await uploadAsync(req, res);

    // Check if name already exists
    const nameExsits = await Club.findOne({
      where: { name: req.body.name },
    });
    if (nameExsits) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "name already in use",
        errors: [{ field: "name", message: "name already in use" }],
      });
    }

    const logo = req.files.logo
      ? `${process.env.BACKEND_URL}/images/club/${req.files.logo[0].filename}`
      : null;
    const backgroundImage = req.files.backgroundImage
      ? `${process.env.BACKEND_URL}/images/club/${req.files.backgroundImage[0].filename}`
      : null;

    // Create club
    const clubCreated = await Club.create({
      name: req.body.name,
      description: req.body.description,
      logo,
      backgroundImage,
      LeagueId: req.body.league,
    });
    if (!clubCreated) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(500).json({
        status: "error",
        message: "Failed to create club",
      });
    }
    console.log("Club created successfully:", clubCreated);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in addClub:", error);

    deleteUploadedFiles(req.files, filePath);

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
