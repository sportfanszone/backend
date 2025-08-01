const { validate: uuidValidate } = require("uuid");

module.exports = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(req.params);

    // Validate postId
    if (!postId || !uuidValidate(postId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    console.log("---Reached here");

    const comments = await require("../../utils/getCommentsByPostId")(postId);

    console.log(comments);

    if (!comments) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Error in getPost:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
