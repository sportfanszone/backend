module.exports = async (req, res) => {
  try {
    const clubs = await require("../utils/getClubs")({
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      clubs: clubs.filter((item) => item.dataValues.followedByUser),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
