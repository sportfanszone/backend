const { League } = require("../../models");
const deleteLeagueImage = require("../../utils/deleteLeagueImage");

module.exports = async (req, res) => {
  try {
    const leagueId = req.params.id;

    // Check if league exists
    const league = await League.findOne({
      where: { id: leagueId },
    });
    if (!league) {
      return res.status(400).json({
        status: "error",
        message: "League not found",
        errors: [{ field: "email", message: "League not found" }],
      });
    }

    // Delete Profile and Cover Photos:
    deleteLeagueImage(league.logo);
    deleteLeagueImage(league.backgroundImage);

    //   Delete league
    const leagueDeleted = await League.destroy({
      where: { id: leagueId },
    });

    if (!leagueDeleted) {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete league",
      });
    }
    console.log(`League deleted successfully:`, leagueDeleted);

    return res.json({
      status: "success",
      message: `League deleted successfully:`,
    });
  } catch (error) {
    console.error("Error in deleteLeague:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
