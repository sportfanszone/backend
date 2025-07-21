const { User } = require("../models");

module.exports = async (id) => {
  try {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "Following",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user with followers and following");
  }
};
