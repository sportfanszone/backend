module.exports = async (req, res) => {
  try {
    const profileViews = [
      {
        id: 1,
        firstName: "Amaka",
        middleName: "Chisom",
        lastName: "Okeke",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 2,
        firstName: "Tunde",
        middleName: "Ayoola",
        lastName: "Fashola",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 3,
        firstName: "Blessing",
        middleName: "Ngozi",
        lastName: "Umeh",
        profileImageUrl: "/images/blankProfile.png",
      },
    ];

    const leaguesYouFollow = [
      {
        id: 1,
        name: "English Premier League",
        backgroundImage: "/images/premierLeagueLogo.png",
      },
      {
        id: 2,
        name: "La Liga",
        backgroundImage: "/images/laLigaLogo.png",
      },
      {
        id: 3,
        name: "Serie A",
        backgroundImage: "/images/serieALogo.png",
      },
    ];

    const clubsYouFollow = [
      {
        id: 2,
        name: "Chelsea",
        backgroundImage: "/images/chelsea.png",
      },
      {
        id: 1,
        name: "Manchester United",
        backgroundImage: "/images/manchesterUnited.png",
      },
      {
        id: 3,
        name: "Arsenal",
        backgroundImage: "/images/arsenalLogo.png",
      },
    ];

    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

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
