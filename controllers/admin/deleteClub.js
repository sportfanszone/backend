const { Club } = require("../../models");
const deleteClubImage = require("../../utils/deleteClubImage");

module.exports = async (req, res) => {
  try {
    const clubId = req.params.id;

    // Check if club exists
    const club = await Club.findOne({
      where: { id: clubId },
    });
    if (!club) {
      return res.status(400).json({
        status: "error",
        message: "Club not found",
        errors: [{ field: "email", message: "Club not found" }],
      });
    }

    // Delete Profile and Cover Photos:
    deleteClubImage(club.logo);
    deleteClubImage(club.backgroundImage);

    //   Delete club
    const clubDeleted = await Club.destroy({
      where: { id: clubId },
    });

    if (!clubDeleted) {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete club",
      });
    }
    console.log(`Club deleted successfully:`, clubDeleted);

    return res.json({
      status: "success",
      message: `Club deleted successfully:`,
    });
  } catch (error) {
    console.error("Error in deleteClub:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
