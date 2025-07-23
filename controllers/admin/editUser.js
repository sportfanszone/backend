const path = require("path");
const { User } = require("../../models");
const { uploadAsync } = require("../../middlewares/userUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const deleteUserImageIfLocal = require("../../utils/deleteUserImageIfLocal");

module.exports = async (req, res) => {
  try {
    const userId = req.params.id;
    const filePath = path.join(process.cwd(), "public", "images", "user");

    await uploadAsync(req, res);

    // Check if exists
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "User not found",
        errors: [{ field: "email", message: "User not found" }],
      });
    }

    if (req.files.profilePhoto) {
      const profilePhoto = req.files.profilePhoto
        ? `${process.env.BACKEND_URL}/images/user/${req.files.profilePhoto[0].filename}`
        : null;

      req.body.profileImageUrl = profilePhoto;
      deleteUserImageIfLocal(user.profileImageUrl);
    }

    if (req.files.coverPhoto) {
      const coverPhoto = req.files.coverPhoto
        ? `${process.env.BACKEND_URL}/images/user/${req.files.coverPhoto[0].filename}`
        : null;

      req.body.coverPhotoUrl = coverPhoto;
      deleteUserImageIfLocal(user.coverPhotoUrl);
    }

    //   Create user
    const userUpdated = await User.update(req.body, {
      where: { id: userId },
    });

    if (!userUpdated) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(500).json({
        status: "error",
        message: "Failed to create user",
      });
    }
    console.log("User deleted successfully:", userUpdated);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in editUser:", error);

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
