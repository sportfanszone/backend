const { User } = require("../models");

module.exports = async (id) => {
  try {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "username"], // Include only the fields you need
          through: { attributes: [] }, // Exclude Follow join table fields
        },
        {
          model: User,
          as: "Following",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });

    console.log(user);
    return user;
  } catch (error) {
    console.error(error); // helpful for debugging
    throw new Error("Error getting user with followers and following");
  }
};
