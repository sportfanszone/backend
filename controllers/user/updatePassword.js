// TODO: create controller to update personal info for users
const { User } = require("../../models");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  try {
    const { id } = req?.user;
    const { oldPassword, newPassword } = req?.body;

    if (!id)
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });

    const user = await User.findByPk(id);
    if (!user)
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });

    if (user.password) {
      const oldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!oldPasswordCorrect)
        return res.status(400).json({
          status: "error",
          message: "Old password is incorrect",
          errors: [{ message: "Old password is incorrect" }],
        });
    }

    const hashedPassword = await require("../../utils/hashPassword")(
      newPassword
    );

    if (!hashedPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password hashing failed",
        errors: [{ message: "Internal server error" }],
      });
    }

    // Update user fields
    user.password = hashedPassword;

    await user.save();

    return res.json({
      status: "success",
      message: "Personal info updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updatePersonalInfo controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
