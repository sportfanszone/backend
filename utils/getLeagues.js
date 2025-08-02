const { League, Club } = require("../models");
const { fn, col, literal } = require("sequelize");

module.exports = async (pinned = false) => {
  try {
    const leagues = await League.findAll({
      where: pinned ? { pinned: true } : {},
      attributes: {
        include: [[fn("COUNT", col("Clubs.id")), "clubCount"]],
      },
      include: [
        {
          model: Club,
          as: "Clubs",
          attributes: [],
        },
      ],
      group: ["League.id"],
      order: [[literal("clubCount"), "DESC"]],
    });

    return leagues;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch pinned leagues");
  }
};
