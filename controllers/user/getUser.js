const getUser = require("../../utils/getUser");
const getAchievements = require("../../utils/getAchievements");

module.exports = async (req, res) => {
  try {
    const { id } = req?.user;

    if (!id)
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });

    const user = await getUser(id);

    if (!user)
      return res.status(400).json({
        status: "error",
        message: "An unexpected error occurred",
        errors: [{ message: "Internal server error" }],
      });

    const achievements = await getAchievements();

    if (achievements) {
      user.dataValues.achievements = achievements;
    }

    return res.json({ status: "success", user });
  } catch (error) {
    console.error("Error in getUser controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
