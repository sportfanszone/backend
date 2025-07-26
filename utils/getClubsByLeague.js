const { Club, Post } = require("../models");
const { fn, col } = require("sequelize");

module.exports = async (leagueId) => {
  try {
    const clubs = await Club.findAll({
      where: { LeagueId: leagueId },
      attributes: {
        include: [[fn("COUNT", col("Posts.id")), "topicCount"]],
      },
      include: [
        {
          model: Post,
          as: "Posts",
          attributes: [],
        },
      ],
      group: ["Club.id"],
    });

    return clubs;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch clubs with post count");
  }
};
