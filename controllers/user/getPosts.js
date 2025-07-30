const getPosts = require("../../utils/getPosts");

module.exports = async (req, res) => {
  try {
    console.log("----Getting posts");
    // Fetch post with associated data
    const posts = await getPosts();
    console.log(posts);

    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error in getPost:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
