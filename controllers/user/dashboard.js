module.exports = async (req, res) => {
  try {
    const profileViews = await require("../../utils/getUsers")({
      excludeUserIds: [req.user.id],
    });

    const leaguesYouFollow = await require("../../utils/getLeagues")({
      limit: 3,
    });

    const clubsYouFollow = await require("../../utils/getClubs")({ limit: 3 });

    // res.clearCookie("userToken", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    // });

    return res.json({
      status: "success",
      profileViews,
      leaguesYouFollow,
      clubsYouFollow,
    });
  } catch (error) {
    console.error("Error in dashboard controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
