const { League, Club } = require("../models");
const { fn, col } = require("sequelize");

module.exports = async (id) => {
  try {
    const leagues = await League.findOne({
      where: { id },
      attributes: {
        include: [[fn("COUNT", col("Clubs.id")), "clubCount"]],
      },
      include: [
        {
          model: Club,
          attributes: [],
          as: "Clubs",
        },
      ],
      group: ["League.id"],
    });

    return leagues;
  } catch (error) {
    throw new Error(error);
  }
};
