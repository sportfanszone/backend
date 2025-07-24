const { User } = require("../models");

module.exports = async (user) => {
  try {
    if (!user || !user.email || !user.username) {
      throw new Error("User data is incomplete");
    }

    if (user.password)
      user.password = await require("./hashPassword")(user.password);

    const newUser = await User.create({ ...user });
    return { user: newUser, status: "success" };
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error("Failed to create user");
  }
};
