const { Post, PostFile, User, Comment } = require("../../models");
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
          where: { type: "image" }, // Only include image files
          required: false,
          attributes: ["url"],
        },
        {
          model: Comment,
          as: "Comments",
          attributes: [], // For counting only
          required: false,
        },
      ],
      attributes: ["id", "title", "content", "createdAt", "likes"],
      group: ["Post.id", "User.id", "PostFiles.id"], // Group to avoid duplicate rows
    });

    console.log(post);

    if (!post) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }

    // Format response
    const formattedPost = {
      id: post.id,
      createdAt: post.createdAt,
      title: post.title,
      content: post.content,
      images: post.PostFiles ? post.PostFiles.map((file) => file.url) : [],
      likes: post.likes || 0,
      shares: 0, // No Share model or field, default to 0
      commentCount: await Comment.count({ where: { PostId: post.id } }),
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
