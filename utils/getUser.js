const { User } = require("../models");

module.exports = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;
  } catch (error) {
    throw new Error("Error getting user");
  }
};
