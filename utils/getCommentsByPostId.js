const { Comment, User, UserLikes } = require("../models");
const { validate: uuidValidate } = require("uuid");

const getCommentsByPostId = async (postId, userId = null, maxDepth = 5) => {
  try {
    // Validate PostId and userId
    if (!postId || !uuidValidate(postId)) {
      throw new Error("Invalid PostId");
    }
    if (userId && !uuidValidate(userId)) {
      throw new Error("Invalid UserId");
    }

    // Collect all comment IDs to query UserLikes
    const allCommentIds = [];

    // Recursive function to count all replies (including nested) for a comment
    const countAllReplies = async (parentCommentId) => {
      const replies = await Comment.findAll({
        where: { ParentCommentId: parentCommentId },
        attributes: ["id"],
      });
      let count = replies.length;
      for (const reply of replies) {
        allCommentIds.push(reply.id); // Collect reply IDs
        count += await countAllReplies(reply.id); // Recurse for nested replies
      }
      return count;
    };

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
          allCommentIds.push(comment.id); // Collect comment ID
          // Count all replies (including nested)
          const replyCount = await countAllReplies(comment.id);

          const replies = await fetchComments(comment.id, depth + 1);

          return {
            id: comment.id,
            replyCount,
            likes: comment.likes,
            shares: comment.shares,
            content: comment.content,
            imageUrl: comment.imageUrl,
            audioUrl: comment.audioUrl,
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

    // Fetch comments
    const comments = await fetchComments();

    // Fetch user likes for all comments if userId is provided
    let userLikes = [];
    if (userId && allCommentIds.length > 0) {
      userLikes = await UserLikes.findAll({
        where: {
          userId,
          CommentId: allCommentIds,
        },
        attributes: ["CommentId"],
      });
    }
    const likedCommentIds = new Set(userLikes.map((like) => like.CommentId));

    // Add likedByUser to each comment and its replies
    const addLikedByUser = (comments) => {
      return comments.map((comment) => ({
        ...comment,
        likedByUser: userId ? likedCommentIds.has(comment.id) : false,
        replies: addLikedByUser(comment.replies),
      }));
    };

    const formattedCommentsWithLikes = addLikedByUser(comments);

    return formattedCommentsWithLikes;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

module.exports = getCommentsByPostId;
