const path = require("path");
const { User } = require("../../models");
const { uploadAsync } = require("../../middlewares/userUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

module.exports = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "public", "images", "user");

    await uploadAsync(req, res);

    // Check if email already is in use
    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (emailExists) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "Email already in use",
        errors: [{ field: "email", message: "Email already in use" }],
      });
    }

    // Check if username already exists
    const usernameExsits = await User.findOne({
      where: { username: req.body.username },
    });
    if (usernameExsits) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "Username already in use",
        errors: [{ field: "username", message: "Username already in use" }],
      });
    }

    const profilePhoto = req.files.profilePhoto
      ? `${process.env.BACKEND_URL}/images/user/${req.files.profilePhoto[0].filename}`
      : null;
    const coverPhoto = req.files.coverPhoto
      ? `${process.env.BACKEND_URL}/images/user/${req.files.coverPhoto[0].filename}`
      : null;

    req.body.profileImageUrl = profilePhoto;
    req.body.coverPhotoUrl = coverPhoto;

    //   Create user
    const userCreated = await require("../../utils/createUser")(req.body);
    if (!userCreated) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(500).json({
        status: "error",
        message: "Failed to create user",
      });
    }
    console.log("User created successfully:", userCreated);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);

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
