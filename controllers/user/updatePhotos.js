const path = require("path");
const multer = require("multer");
const { uploadAsync } = require("../../middlewares/userUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const { User } = require("../../models");

module.exports = async (req, res) => {
  const filePath = path.join(process.cwd(), "public", "images", "user");
  try {
    // Upload files
    await uploadAsync(req, res);

    const { id } = req?.user;

    if (!id) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });
    }

    const profilePhoto = req.files.profilePhoto
      ? `${process.env.BACKEND_URL}/images/user/${req.files.profilePhoto[0].filename}`
      : null;
    const coverPhoto = req.files.coverPhoto
      ? `${process.env.BACKEND_URL}/images/user/${req.files.coverPhoto[0].filename}`
      : null;

    // Update user fields
    if (profilePhoto) user.profileImageUrl = profilePhoto;
    if (coverPhoto) user.coverPhotoUrl = coverPhoto;
    await user.save();

    return res.json({
      status: "success",
      message: "Personal info updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updatePersonalInfo controller:", error);

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

    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
