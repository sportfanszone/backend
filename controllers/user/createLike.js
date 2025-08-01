const { UserLikes, Post, Comment } = require("../../models");

module.exports = async (req, res) => {
  try {
    console.log(req.body);
    const { postId, commentId } = req.body;
    const userId = req.user.id; // Assumes auth middleware sets req.user

    // Validate input
    if (!postId && !commentId) {
      return res.status(400).json({
        status: "error",
        message: "postId or commentId required",
      });
    }
    if (postId && commentId) {
      return res.status(400).json({
        status: "error",
        message: "Provide only one of postId or commentId",
      });
    }

    // Validate existence of Post or Comment
    let likeCount = 0;
    if (postId) {
      const post = await Post.findByPk(postId, { attributes: ["id", "likes"] });
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "Post not found",
        });
      }
      likeCount = post.likes;
    } else {
      const comment = await Comment.findByPk(commentId, {
        attributes: ["id", "likes"],
      });
      if (!comment) {
        return res.status(404).json({
          status: "error",
          message: "Comment not found",
        });
      }
      likeCount = comment.likes;
    }

    // Check if user has already liked
    const existingLike = await UserLikes.findOne({
      where: {
        userId,
        ...(postId ? { PostId: postId } : { CommentId: commentId }),
      },
    });

    let liked = false;

    if (existingLike) {
      // Unlike: Delete the like and decrement likes count
      await existingLike.destroy();
      if (postId) {
        await Post.decrement("likes", { where: { id: postId } });
        const post = await Post.findByPk(postId, { attributes: ["likes"] });
        likeCount = post ? post.likes : 0;
      } else {
        await Comment.decrement("likes", { where: { id: commentId } });
        const comment = await Comment.findByPk(commentId, {
          attributes: ["likes"],
        });
        likeCount = comment ? comment.likes : 0;
      }
    } else {
      // Like: Create new like and increment likes count
      await UserLikes.create({
        userId,
        PostId: postId || null,
        CommentId: commentId || null,
      });
      if (postId) {
        await Post.increment("likes", { where: { id: postId } });
        const post = await Post.findByPk(postId, { attributes: ["likes"] });
        likeCount = post ? post.likes : 0;
      } else {
        await Comment.increment("likes", { where: { id: commentId } });
        const comment = await Comment.findByPk(commentId, {
          attributes: ["likes"],
        });
        likeCount = comment ? comment.likes : 0;
      }
      liked = true;
    }

    return res.status(200).json({
      status: "success",
      message: liked ? "Liked successfully" : "Unliked successfully",
      data: { liked, likeCount },
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to toggle like",
    });
  }
};
