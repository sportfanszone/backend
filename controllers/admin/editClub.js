const path = require("path");
const { Club } = require("../../models");
const { uploadAsync } = require("../../middlewares/clubUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const deleteClubImageIfLocal = require("../../utils/deleteClubImageIfLocal");

module.exports = async (req, res) => {
  const filePath = path.join(process.cwd(), "public", "images", "club");
  try {
    const clubId = req.params.id;

    await uploadAsync(req, res);

    // Check if exists
    const club = await Club.findOne({
      where: { id: clubId },
    });
    if (!club) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "Club not found",
        errors: [{ field: "email", message: "Club not found" }],
      });
    }

    if (req.files.logo) {
      const logo = req.files.logo
        ? `${process.env.BACKEND_URL}/images/club/${req.files.logo[0].filename}`
        : null;

      req.body.logo = logo;
      deleteClubImageIfLocal(club.logo);
    }

    if (req.files.backgroundImage) {
      const backgroundImage = req.files.backgroundImage
        ? `${process.env.BACKEND_URL}/images/club/${req.files.backgroundImage[0].filename}`
        : null;

      req.body.backgroundImage = backgroundImage;
      deleteClubImageIfLocal(club.backgroundImage);
    }

    console.log(req.body);

    //   Create club
    const clubUpdated = await Club.update(req.body, {
      where: { id: clubId },
    });

    if (!clubUpdated) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(500).json({
        status: "error",
        message: "Failed to create club",
      });
    }
    console.log("Club edited successfully:", clubUpdated);

    return res.json({
      status: "success",
      message: "Club edited successfully",
    });
  } catch (error) {
    console.error("Error in editClub:", error);

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
