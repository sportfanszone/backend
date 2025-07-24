const { User } = require("../../models");

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

    const password = await require("../../utils/hashPassword")(
      req.body.password
    );

    //   Create user
    const userUpdated = await User.update(
      { password },
      {
        where: { id: userId },
      }
    );

    if (!userUpdated) {
      return res.status(500).json({
        status: "error",
        message: "Failed to reset user password",
      });
    }
    console.log("User passwrod reset successfully:", userUpdated);

    return res.json({
      status: "success",
      message: "User passwrod reset successfully",
    });
  } catch (error) {
    console.error("Error in resetUserPassword:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
