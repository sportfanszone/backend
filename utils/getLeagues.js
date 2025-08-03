const { League, Club } = require("../models");
const { fn, col, Op } = require("sequelize");

async function getLeagues(options = {}) {
  try {
    const {
      where = {},
      attributes = [
        "id",
        "name",
        "description",
        "logo",
        "backgroundImage",
        "pinned",
        "lastAccess",
      ],
      order = [[fn("COUNT", col("Clubs.id")), "DESC"]],
      limit = 10,
      offset = 0,
      include = [
        {
          model: Club,
          as: "Clubs",
          attributes: [],
          required: false,
        },
      ],
      excludeLeagueIds = [],
    } = options;

    const finalWhere = {
      ...where,
      id: {
        [Op.notIn]: excludeLeagueIds,
      },
    };

    const leagues = await League.findAll({
      where: finalWhere,
      attributes: [...attributes, [fn("COUNT", col("Clubs.id")), "clubCount"]],
      include,
      group: attributes.map((attr) => `League.${attr}`),
      order,
      limit,
      offset,
      subQuery: false,
    });

    return leagues;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    throw new Error(error.message || "Failed to fetch leagues");
  }
}

module.exports = getLeagues;
