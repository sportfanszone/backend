const { UserClub, Club } = require("../../models");

module.exports = async (req, res) => {
  console.log(req.params);
  try {
    const userId = req.user?.id;
    const clubId = req.params.clubId;

    console.log("userId, clubId");
    console.log(userId, clubId);

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
        followed: true,
      });
    }

    const club = await Club.findByPk(clubId);
    console.log("club");
    console.log(club);
    if (!club) {
      return res.status(404).json({
        status: "error",
        message: "Club not found",
        followed: true,
      });
    }

    const existing = await UserClub.findOne({
      where: { UserId: userId, ClubId: clubId },
    });
    console.log("existing");
    console.log(existing);

    if (existing) {
      await existing.destroy();
      return res.status(200).json({
        status: "success",
        message: "Successfully unfollowed the club",
        followed: false,
      });
    } else {
      const a = await UserClub.create({ UserId: userId, ClubId: clubId });
      console.log("a");
      console.log(a);

      return res.status(200).json({
        status: "success",
        message: "Successfully followed the club",
        followed: true,
      });
    }
  } catch (error) {
    console.error("Error toggling club membership:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to toggle club membership",
      followed: true,
    });
  }
};
