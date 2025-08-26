const { validate: uuidValidate } = require("uuid");
const getPosts = require("../../utils/getPosts");

module.exports = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !uuidValidate(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
      });
    }

    // Fetch posts with pagination
    const { offset = 0, limit = 10 } = req.query;
    const posts = await getPosts({ userId, offset, limit });

    return res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
