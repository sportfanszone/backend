const { League, Club } = require("../../models");
const { fn, col } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const leagues = await League.findAll({
      where: { pinned: true },
      attributes: {
        include: [[fn("COUNT", col("Clubs.id")), "clubCount"]],
      },
      include: [
        {
          model: Club,
          attributes: [],
        },
      ],
      group: ["League.id"],
    });

    console.log("Leagues:");
    console.log(leagues);

    res.json({
      leagues,
      status: "success",
    });
  } catch (error) {
    console.error("Error in getLeagues controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
