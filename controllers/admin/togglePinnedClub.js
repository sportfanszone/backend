const { Club } = require("../../models");

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

    //   Create club
    club.pinned = !club.pinned;
    const clubUpdated = await club.save();

    if (!clubUpdated) {
      return res.status(500).json({
        status: "error",
        message: `Failed to ${club.pinned ? "Unpin" : "Pin"} club`,
      });
    }

    return res.json({
      status: "success",
      message: `Club ${club.pinned ? "Unpinned" : "Pinned"} successfully:`,
    });
  } catch (error) {
    console.error("Error in togglePinnedClub:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
