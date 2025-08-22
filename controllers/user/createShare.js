const { Post, Comment } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

    // Validate input: ensure either postId or commentId is provided, but not both
    if (!postId && !commentId) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: postId or commentId",
      });
    }
    if (postId && commentId) {
      return res.status(400).json({
        status: "error",
        message: "Provide only one of postId or commentId",
      });
    }

    let updatedShareCount;

    // Handle Post share
    if (postId) {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "Post not found",
        });
      }
      await post.increment("shares", { by: 1 });
      await post.reload(); // Refresh the post to get the updated shares count
      updatedShareCount = post.shares;
    }

    // Handle Comment share
    if (commentId) {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({
          status: "error",
          message: "Comment not found",
        });
      }
      await comment.increment("shares", { by: 1 });
      await comment.reload(); // Refresh the comment to get the updated shares count
      updatedShareCount = comment.shares;
    }

    return res.status(200).json({
      status: "success",
      message: "Share recorded successfully",
      data: {
        shareCount: updatedShareCount,
      },
    });
  } catch (error) {
    console.error("Error in createShare:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
