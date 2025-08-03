const getUsers = require("../../utils/getUsers");

module.exports = async (req, res) => {
  try {
    const userId = req.user?.id;
    const contributors = await getUsers({
      limit: 12,
      excludeUserIds: [userId],
    });

    res.json({
      contributors,
    });
  } catch (error) {
    console.error("Error in getContributors controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
