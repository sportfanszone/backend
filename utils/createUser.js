const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = async (user) => {
  try {
    if (!user || !user.email || !user.username) {
      throw new Error("User data is incomplete");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    // Create user
    const newUser = await User.create({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profileImageUrl: user.profileImageUrl || null,
      password,
      lastAccess: Date.now(),
    });
    return { user: newUser, status: "success" };
  } catch (error) {
    console.log("Error in createUser:", error);
    throw new Error("Failed to create user");
  }
};
