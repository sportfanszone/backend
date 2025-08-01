require("dotenv").config();
const { Comment, User } = require("../models");

const getCommentsByPostId = async (postId, maxDepth = 5) => {
  try {
    // Validate PostId
    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid PostId");
    }

    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

    // Recursive function to fetch comments and their replies
    const fetchComments = async (parentCommentId = null, depth = 0) => {
      if (depth > maxDepth) return [];

      const where = parentCommentId
        ? { ParentCommentId: parentCommentId }
        : { PostId: postId, ParentCommentId: null };

      const comments = await Comment.findAll({
        where,
        include: [
          {
            model: User,
            as: "User",
            attributes: [
              "id",
              "firstName",
              "middleName",
              "lastName",
              "username",
              "profileImageUrl",
            ],
          },
          {
            model: Comment,
            as: "Parent",
            include: [
              {
                model: User,
                as: "User",
                attributes: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "username",
                  "profileImageUrl",
                ],
              },
            ],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Map comments to desired format
      const formattedComments = await Promise.all(
        comments.map(async (comment) => {
          const replyCount = await Comment.count({
            where: { ParentCommentId: comment.id },
          });

          const replies = await fetchComments(comment.id, depth + 1);

          // Prepend BACKEND_URL to relative paths
          const imageUrl = comment.imageUrl
            ? comment.imageUrl.startsWith("http")
              ? comment.imageUrl
              : `${BACKEND_URL}${comment.imageUrl}`
            : null;
          const audioUrl = comment.audioUrl
            ? comment.audioUrl.startsWith("http")
              ? comment.audioUrl
              : `${BACKEND_URL}${comment.audioUrl}`
            : null;

          return {
            id: comment.id,
            replyCount,
            likes: comment.likes,
            shares: comment.shares,
            content: comment.content,
            imageUrl,
            audioUrl,
            user: comment.User
              ? {
                  id: comment.User.id,
                  firstName: comment.User.firstName,
                  middleName: comment.User.middleName,
                  lastName: comment.User.lastName,
                  username: comment.User.username,
                  profileImageUrl: comment.User.profileImageUrl,
                }
              : null,
            replyTo: comment.Parent?.User
              ? {
                  id: comment.Parent.User.id,
                  firstName: comment.Parent.User.firstName,
                  middleName: comment.Parent.User.middleName,
                  lastName: comment.Parent.User.lastName,
                  username: comment.Parent.User.username,
                  profileImageUrl: comment.Parent.User.profileImageUrl,
                }
              : null,
            replies,
          };
        })
      );

      return formattedComments;
    };

    const comments = await fetchComments();
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

module.exports = getCommentsByPostId;
