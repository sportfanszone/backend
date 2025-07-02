const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = async (user) => {
  try {
    if (!user || !user.email || !user.username) {
      throw new Error("User data is incomplete");
    }

    let password;

    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(user.password, salt);
      user.password = password;
    }

    const newUser = await User.create({ ...user });
    return { user: newUser, status: "success" };
  } catch (error) {
    console.log("Error in createUser:", error);
    throw new Error("Failed to create user");
  }
};
