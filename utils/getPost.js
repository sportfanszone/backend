const { Post, PostFile, User, Comment, UserLikes } = require("../models");
const { validate: uuidValidate } = require("uuid");
const { Op } = require("sequelize");

const getPost = async (postId, options = {}) => {
  try {
    // Default options
    const { clubId, userId, targetUserId, since } = options;

    // Validate UUIDs
    if (!uuidValidate(postId)) {
      throw new Error("Invalid Post ID format");
    }
    if (clubId && !uuidValidate(clubId)) {
      throw new Error("Invalid Club ID format");
    }
    if (targetUserId && !uuidValidate(targetUserId)) {
      throw new Error("Invalid Target User ID format");
    }
    if (userId && !uuidValidate(userId)) {
      throw new Error("Invalid Authenticated User ID format");
    }

    // Build where clause
    const where = { id: postId };
    if (clubId) where.ClubId = clubId;
    if (targetUserId) where.UserId = targetUserId;
    if (since) where.createdAt = { [Op.gt]: new Date(since) };

    // Fetch post
    const post = await Post.findOne({
      where,
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
      attributes: [
        "id",
        "title",
        "content",
        "link",
        "createdAt",
        "likes",
        "shares",
      ],
    });

    // If post not found
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user liked the post
    let likedByUser = false;
    if (userId) {
      const userLike = await UserLikes.findOne({
        where: {
          userId,
          PostId: post.id,
        },
        attributes: ["PostId"],
      });
      likedByUser = !!userLike;
    }

    // Format post
    const formattedPost = {
      id: post.id,
      createdAt: post.createdAt,
      title: post.title,
      content: post.content,
      images: post.PostFiles
        ? post.PostFiles.map((file) =>
            file.url.startsWith("http")
              ? file.url
              : `${process.env.BACKEND_URL || "http://localhost:3001"}${
                  file.url
                }`
          )
        : [],
      likes: post.likes || 0,
      shares: post.shares || 0,
      commentCount: await Comment.count({ where: { PostId: post.id } }),
      likedByUser,
      link: post.link,
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

    return formattedPost;
  } catch (error) {
    console.error("Error in getPost:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
};

module.exports = getPost;
