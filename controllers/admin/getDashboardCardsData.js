const { User, Post, League, Club } = require("../../models");

module.exports = async function getDashboardCardsData(req, res) {
  try {
    const [totalUsers, totalPosts, totalLeagues, totalClubs] =
      await Promise.all([
        User.count(),
        Post.count(),
        League.count(),
        Club.count(),
      ]);

    console.table({
      status: "success",
      totalUsers,
      totalPosts,
      totalLeagues,
      totalClubs,
    });

    return res.status(200).json({
      status: "success",
      totalUsers,
      totalPosts,
      totalLeagues,
      totalClubs,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard counts:", error);

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};
