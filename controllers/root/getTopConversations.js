const getPosts = require("../../utils/getPosts");

module.exports = async (req, res) => {
  try {
    const userId = req.user?.id;
    const posts = await getPosts({ userId });

    res.json({
      posts,
      status: "success",
    });
  } catch (error) {
    console.error("Error in getTopConversations controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
