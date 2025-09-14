const { Club, Post, UserClub } = require("../models");
const { fn, col, Op, literal } = require("sequelize");

async function getClubs(options = {}) {
  try {
    const {
      userId, // Add userId to options to check membership
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

    // Add UserClub include to check membership
    const userClubInclude = userId
      ? [
          {
            model: UserClub,
            as: "UserClubs",
            attributes: [],
            where: { UserId: userId },
            required: false,
          },
        ]
      : [];

    const clubs = await Club.findAll({
      where: finalWhere,
      attributes: [
        ...attributes,
        [fn("COUNT", col("Posts.id")), "topicCount"],
        // Add followedByUser as a boolean based on whether a UserClub record exists
        [
          literal(`EXISTS (
            SELECT 1 FROM UserClubs
            WHERE UserClubs.ClubId = Club.id
            AND UserClubs.UserId = ${userId ? `'${userId}'` : "NULL"}
          )`),
          "followedByUser",
        ],
      ],
      include: [...include, ...userClubInclude],
      group: [...attributes.map((attr) => `Club.${attr}`), "Club.id"],
      order,
      limit,
      offset,
      subQuery: false,
    });

    console.log(userId);
    console.log("clubs");
    console.log(clubs);
    return clubs;
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw new Error(error.message || "Failed to fetch clubs");
  }
}

module.exports = getClubs;
