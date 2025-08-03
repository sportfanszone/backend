const { Club, Post } = require("../models");
const { fn, col, Op } = require("sequelize");

async function getClubs(options = {}) {
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
      order = [[fn("COUNT", col("Posts.id")), "DESC"]],
      limit = 10,
      offset = 0,
      include = [
        {
          model: Post,
          as: "Posts",
          attributes: [],
          required: false,
        },
      ],
      excludeClubIds = [],
    } = options;

    const finalWhere = {
      ...where,
      id: {
        [Op.notIn]: excludeClubIds,
      },
    };

    const clubs = await Club.findAll({
      where: finalWhere,
      attributes: [...attributes, [fn("COUNT", col("Posts.id")), "topicCount"]],
      include,
      group: attributes.map((attr) => `Club.${attr}`),
      order,
      limit,
      offset,
      subQuery: false,
    });

    return clubs;
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw new Error(error.message || "Failed to fetch clubs");
  }
}

module.exports = getClubs;
