const { Post, PostFile, User, Comment, UserLikes } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const {
      club: clubIdFromQuery,
      q: searchQuery = "",
      page = 1,
      limit = 10,
    } = req.query;

    const clubId = clubIdFromQuery;
    const userId = req.user ? req.user.id : null;
    const targetUserId = null;
    const sortBy = "createdAt";
    const sortOrder = "DESC";
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    if (clubId) where.ClubId = clubId;
    if (targetUserId) where.UserId = targetUserId;
    if (searchQuery && searchQuery.trim() !== "") {
      where[Op.or] = [
        { title: { [Op.substring]: `%${searchQuery}%` } },
        { content: { [Op.substring]: `%${searchQuery}%` } },
      ];
    }

    // Fetch posts and count
    const { rows: posts, count } = await Post.findAndCountAll({
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
      attributes: ["id", "title", "content", "createdAt", "likes"],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset,
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

    const topContributors = [
      {
        id: 1,
        firstName: "John",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 2,
        firstName: "Jane",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 3,
        firstName: "Alice",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 4,
        firstName: "Bob",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 5,
        firstName: "Charlie",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 6,
        firstName: "Dave",
        profileImageUrl: "/images/blankProfile.png",
      },
    ];

    res.json({ topics: formattedPosts, total: count, topContributors });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
