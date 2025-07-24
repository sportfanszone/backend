const bcrypt = require("bcryptjs");

module.exports = async (password) => {
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error("Failed to hash password");
  }
};
