const { Post, PostFile, User, Comment, UserLikes } = require("../../models");
const { validate: uuidValidate } = require("uuid");

module.exports = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Assumes auth middleware sets req.user

    // Validate postId
    if (!postId || !uuidValidate(postId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    // Fetch post with associated data
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "User",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "username",
            "profileImageUrl",
          ],
        },
        {
          model: PostFile,
          where: { type: "image" },
          required: false,
          attributes: ["url"],
          as: "PostFiles",
        },
        {
          model: Comment,
          as: "Comments",
          attributes: [],
          required: false,
        },
      ],
      attributes: ["id", "title", "link", "content", "createdAt", "likes"],
      group: ["Post.id", "User.id", "PostFiles.id"],
    });

    if (!post) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }

    // Check if the current user has liked the post
    const userLike = await UserLikes.findOne({
      where: { userId, PostId: postId },
    });
    const likedByUser = !!userLike;

    // Count all comments and replies for the post
    const countAllComments = async (postId) => {
      // Count top-level comments
      const topLevelCount = await Comment.count({
        where: { PostId: postId, ParentCommentId: null },
      });

      // Fetch top-level comments to get their IDs
      const topLevelComments = await Comment.findAll({
        where: { PostId: postId, ParentCommentId: null },
        attributes: ["id"],
      });

      let replyCount = 0;
      // Recursively count replies for each top-level comment
      for (const comment of topLevelComments) {
        const countReplies = async (parentCommentId) => {
          const replies = await Comment.findAll({
            where: { ParentCommentId: parentCommentId },
            attributes: ["id"],
          });
          let count = replies.length;
          for (const reply of replies) {
            count += await countReplies(reply.id); // Recurse for nested replies
          }
          return count;
        };
        replyCount += await countReplies(comment.id);
      }

      return topLevelCount + replyCount;
    };

    // Format response
    const formattedPost = {
      id: post.id,
      createdAt: post.createdAt,
      title: post.title,
      content: post.content,
      images: post.PostFiles
        ? post.PostFiles.map((file) => {
            // Prepend BACKEND_URL to relative paths
            return file.url.startsWith("http")
              ? file.url
              : `${process.env.BACKEND_URL || "http://localhost:3001"}${
                  file.url
                }`;
          })
        : [],
      likes: post.likes || 0,
      link: post.link,
      shares: 0,
      commentCount: await countAllComments(post.id),
      likedByUser, // Add whether the current user liked the post
      user: post.User
        ? {
            firstName: post.User.firstName,
            middleName: post.User.middleName || "",
            lastName: post.User.lastName || "",
            username: post.User.username,
            profileImageUrl: post.User.profileImageUrl || "",
          }
        : null,
    };

    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      post: formattedPost,
    });
  } catch (error) {
    console.error("Error in getPost:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
