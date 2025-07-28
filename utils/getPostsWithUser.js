const { Post, User } = require("../models");

module.exports = async function getPostsWithUser(options = {}) {
  try {
    console.log({ ...options });
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: [
            "username",
            "firstName",
            "middleName",
            "lastName",
            "profileImageUrl",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      ...options, // allow limit, offset, etc.
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      likes: post.likes,
      comments: post.comments,
      upVotes: post.upVotes,
      createdAt: post.createdAt,
      user: post.User
        ? {
            username: post.User.username,
            firstName: post.User.firstName,
            middleName: post.User.middleName,
            lastName: post.User.lastName,
            profileImageUrl: post.User.profileImageUrl,
          }
        : [],
    }));
  } catch (error) {
    console.error("Error fetching posts with user:", error);
    throw new Error("Could not retrieve posts");
  }
};
