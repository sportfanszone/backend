const { League, Club } = require("../models");
const { fn, col } = require("sequelize");

module.exports = async () => {
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

    return leagues;
  } catch (error) {
    throw new Error(error);
  }
};
