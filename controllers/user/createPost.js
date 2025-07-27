const path = require("path");
const multer = require("multer");
const { Post, PostFile } = require("../../models");
const { uploadAsync } = require("../../middlewares/postUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

module.exports = async (req, res) => {
  const filePath = path.join(process.cwd(), "public", "images", "post");

  try {
    // Handle file upload
    await uploadAsync(req, res);

    // Validate title and content
    const { title, content, link, clubId } = req.body;
    if (!title || !content || !clubId) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      link: link || null,
      ClubId: clubId,
      UserId: req.user.id || null,
    });

    // Handle files (if any)
    if (req.files?.files?.length) {
      const files = req.files.files.map((file) => ({
        url: `${process.env.BACKEND_URL}/images/post/${file.filename}`,
        type: file.mimetype.startsWith("video") ? "video" : "image",
        PostId: post.id,
      }));

      await PostFile.bulkCreate(files);
    }

    return res.status(200).json({
      status: "success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error in addPost:", error);

    deleteUploadedFiles(req.files, filePath);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "error",
          message: "File size too large. Maximum file size is 2MB",
        });
      }
      return res.status(400).json({
        status: "error",
        message: "Failed to upload file",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
