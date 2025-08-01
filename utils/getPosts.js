const { Post, PostFile, User, Comment, UserLikes } = require("../models");
const { validate: uuidValidate } = require("uuid");

const getAllPosts = async (options = {}) => {
  try {
    // Default options
    const {
      clubId,
      userId,
      targetUserId,
      sortBy = "createdAt",
      sortOrder = "DESC",
      limit = 10,
      offset = 0,
    } = options;

    // Validate UUIDs if provided
    if (clubId && !uuidValidate(clubId)) {
      throw new Error("Invalid Club ID format");
    }
    if (targetUserId && !uuidValidate(targetUserId)) {
      throw new Error("Invalid Target User ID format");
    }
    if (userId && !uuidValidate(userId)) {
      throw new Error("Invalid Authenticated User ID format");
    }

    // Validate sortBy and sortOrder
    const validSortFields = ["createdAt", "likes"];
    const validSortOrders = ["ASC", "DESC"];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(
        `Invalid sortBy value. Must be one of: ${validSortFields.join(", ")}`
      );
    }
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(
        `Invalid sortOrder value. Must be one of: ${validSortOrders.join(", ")}`
      );
    }

    // Build where clause
    const where = {};
    if (clubId) where.ClubId = clubId;
    if (targetUserId) where.UserId = targetUserId;

    // Fetch posts
    const posts = await Post.findAll({
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
        },
        {
          model: Comment,
          as: "Comments",
          attributes: [],
          required: false,
        },
      ],
      attributes: ["id", "title", "content", "createdAt", "likes"],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Fetch user likes for all posts if userId is provided
    let userLikes = [];
    if (userId) {
      const postIds = posts.map((post) => post.id);
      userLikes = await UserLikes.findAll({
        where: {
          userId,
          PostId: postIds,
        },
        attributes: ["PostId"],
      });
    }
    const likedPostIds = new Set(userLikes.map((like) => like.PostId));

    // Format posts
    const formattedPosts = await Promise.all(
      posts.map(async (post) => ({
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
        shares: 0,
        commentCount: await Comment.count({ where: { PostId: post.id } }),
        likedByUser: userId ? likedPostIds.has(post.id) : false,
        user: post.User
          ? {
              firstName: post.User.firstName,
              middleName: post.User.middleName || "",
              lastName: post.User.lastName || "",
              username: post.User.username,
              profileImageUrl: post.User.profileImageUrl || "",
            }
          : null,
      }))
    );

    return formattedPosts;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
};

module.exports = getAllPosts;
