const path = require("path");
const { League } = require("../../models");
const { uploadAsync } = require("../../middlewares/leagueUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const deleteLeagueImageIfLocal = require("../../utils/deleteLeagueImageIfLocal");

module.exports = async (req, res) => {
  const filePath = path.join(process.cwd(), "public", "images", "league");
  try {
    const leagueId = req.params.id;

    await uploadAsync(req, res);

    // Check if exists
    const league = await League.findOne({
      where: { id: leagueId },
    });
    if (!league) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "League not found",
        errors: [{ field: "email", message: "League not found" }],
      });
    }

    if (req.files.logo) {
      const logo = req.files.logo
        ? `${process.env.BACKEND_URL}/images/league/${req.files.logo[0].filename}`
        : null;

      req.body.logo = logo;
      deleteLeagueImageIfLocal(league.logo);
    }

    if (req.files.backgroundImage) {
      const backgroundImage = req.files.backgroundImage
        ? `${process.env.BACKEND_URL}/images/league/${req.files.backgroundImage[0].filename}`
        : null;

      req.body.backgroundImage = backgroundImage;
      deleteLeagueImageIfLocal(league.backgroundImage);
    }

    console.log(req.body);

    //   Create league
    const leagueUpdated = await League.update(req.body, {
      where: { id: leagueId },
    });

    if (!leagueUpdated) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(500).json({
        status: "error",
        message: "Failed to create league",
      });
    }
    console.log("League deleted successfully:", leagueUpdated);

    return res.json({
      status: "success",
      message: "League deleted successfully",
    });
  } catch (error) {
    console.error("Error in editLeague:", error);

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
