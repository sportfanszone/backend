const { validate: uuidValidate } = require("uuid");
const getPosts = require("../../utils/getPosts");

module.exports = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !uuidValidate(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    // Fetch post with associated data
    const posts = await getPosts({ userId });
    console.log(posts);

    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error in getPost:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
