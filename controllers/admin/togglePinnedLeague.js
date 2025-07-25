const { League } = require("../../models");

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

    //   Create league
    league.pinned = !league.pinned;
    const leagueUpdated = await league.save();

    if (!leagueUpdated) {
      return res.status(500).json({
        status: "error",
        message: `Failed to ${league.pinned ? "Unpin" : "Pin"} league`,
      });
    }

    return res.json({
      status: "success",
      message: `League ${league.pinned ? "Unpinned" : "Pinned"} successfully:`,
    });
  } catch (error) {
    console.error("Error in togglePinnedLeague:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
