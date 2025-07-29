const path = require("path");
const multer = require("multer");
const { Comment, Post } = require("../../models");
const { uploadAsync } = require("../../middlewares/commentUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
const { validate: uuidValidate } = require("uuid");

module.exports = async (req, res) => {
  const imageFilePath = path.join(process.cwd(), "public", "images", "comment");
  const audioFilePath = path.join(process.cwd(), "public", "audios", "comment");

  try {
    // Handle file upload
    await uploadAsync(req, res);
    console.log(req.body);
    console.log(req.files);

    // Validate required fields
    const { content, PostId, ParentCommentId } = req.body;
    if (!content && !req.files?.image && !req.files?.audio) {
      deleteUploadedFiles(req.files, imageFilePath);
      deleteUploadedFiles(req.files, audioFilePath);
      return res.status(400).json({
        status: "error",
        message: "Add text, an image, or an audio file to your comment",
      });
    }

    // Validate PostId or ParentCommentId
    if (!PostId && !ParentCommentId) {
      deleteUploadedFiles(req.files, imageFilePath);
      deleteUploadedFiles(req.files, audioFilePath);
      return res.status(400).json({
        status: "error",
        message: "Comment must be a reply to a post or another comment",
      });
    }

    // Validate UUID format for PostId or ParentCommentId
    if (PostId && !uuidValidate(PostId)) {
      deleteUploadedFiles(req.files, imageFilePath);
      deleteUploadedFiles(req.files, audioFilePath);
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    if (ParentCommentId && !uuidValidate(ParentCommentId)) {
      deleteUploadedFiles(req.files, imageFilePath);
      deleteUploadedFiles(req.files, audioFilePath);
      return res.status(400).json({
        status: "error",
        message: "Invalid parent comment ID format",
      });
    }

    // Validate that PostId or ParentCommentId exists
    if (PostId) {
      const postExists = await Post.findByPk(PostId);
      if (!postExists) {
        deleteUploadedFiles(req.files, imageFilePath);
        deleteUploadedFiles(req.files, audioFilePath);
        return res.status(404).json({
          status: "error",
          message: "Post not found",
        });
      }
    }

    if (ParentCommentId) {
      const parentCommentExists = await Comment.findByPk(ParentCommentId);
      if (!parentCommentExists) {
        deleteUploadedFiles(req.files, imageFilePath);
        deleteUploadedFiles(req.files, audioFilePath);
        return res.status(404).json({
          status: "error",
          message: "Parent comment not found",
        });
      }
    }

    // Prepare comment data
    const commentData = {
      content: content || null,
      imageUrl: req.files?.image
        ? `${process.env.BACKEND_URL}/images/comment/${
            Array.isArray(req.files.image)
              ? req.files.image[0].filename
              : req.files.image.filename
          }`
        : null,
      audioUrl: req.files?.audio
        ? `${process.env.BACKEND_URL}/audios/comment/${
            Array.isArray(req.files.audio)
              ? req.files.audio[0].filename
              : req.files.audio.filename
          }`
        : null,
      PostId: PostId || null,
      ParentCommentId: ParentCommentId || null,
      UserId: req.user.id,
    };

    // Create comment
    const comment = await Comment.create(commentData);

    return res.status(200).json({
      status: "success",
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Error in createComment:", error);

    deleteUploadedFiles(req.files, imageFilePath);
    deleteUploadedFiles(req.files, audioFilePath);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "error",
          message: "File size too large. Maximum file size is 2MB",
        });
      }
      return res.status(400).json({
        status: "error",
        message: `Failed to upload file: ${error.message}`,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
