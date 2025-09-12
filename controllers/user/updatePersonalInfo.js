// TODO: create controller to update personal info for users
const { User } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { id } = req?.user;
    const { firstName, middleName, lastName, username } = req?.body;

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

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (middleName) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;

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
