const { User } = require("../../models");
const deleteUserImageIfLocal = require("../../utils/deleteUserImageIfLocal");

module.exports = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
        errors: [{ field: "email", message: "User not found" }],
      });
    }

    // Delete Profile and Cover Photos:
    deleteUserImageIfLocal(user.profileImageUrl);
    deleteUserImageIfLocal(user.coverPhotoUrl);

    //   Delete user
    const userDeleted = await User.destroy({
      where: { id: userId },
    });

    if (!userDeleted) {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete user",
      });
    }
    console.log(`User deleted successfully:`, userDeleted);

    return res.json({
      status: "success",
      message: `User deleted successfully:`,
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
