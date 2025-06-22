module.exports = async (req, res) => {
  try {
    const clubs = [
      {
        id: 1,
        clubName: "Manchester City",
        topicCount: 142,
        lastActivity: "Today, 09:14",
        description:
          "The most competitive football club in the world, featuring top English clubs.",
        logo: "/images/manchesterCityLogo.png",
        backgroundImage: "/images/manchesterCityBackgroundImage.png",
      },
      {
        id: 2,
        clubName: "Arsenal",
        topicCount: 95,
        lastActivity: "Yesterday, 22:08",
        description:
          "Spain’s top-tier club, known for its flair, rivalries, and legendary players.",
        logo: "/images/arsenalLogo.png",
        backgroundImage: "/images/arsenalBackgroundImage.png",
      },
      {
        id: 3,
        clubName: "Liverpool",
        topicCount: 110,
        lastActivity: "Today, 06:45",
        description:
          "Germany’s premier club, combining strong fan culture and attacking football.",
        logo: "/images/liverpool.png",
        backgroundImage: "/images/liverpoolBackgroundImage.png",
      },
      {
        id: 4,
        clubName: "Chelsea",
        topicCount: 87,
        lastActivity: "2 days ago, 18:33",
        description:
          "Italy’s historic club, home to tactical brilliance and legendary defenders.",
        logo: "/images/chelsea.png",
        backgroundImage: "/images/chelseaBackgroundImage.png",
      },
      {
        id: 5,
        clubName: "Manchester United",
        topicCount: 74,
        lastActivity: "Today, 11:01",
        description:
          "France’s top club, spotlighting young talents and dominant PSG performances.",
        logo: "/images/manchesterUnited.png",
        backgroundImage: "/images/manchesterUnitedBackgroundImage.png",
      },
      {
        id: 6,
        clubName: "Tottenham Hotspur",
        topicCount: 63,
        lastActivity: "Yesterday, 20:17",
        description:
          "North America’s growing club, blending global stars and rising talents.",
        logo: "/images/tottenhamHotspur.png",
        backgroundImage: "/images/tottenhamHotspurBackgroundImage.png",
      },
    ];

    const league = {
      id: "1",
      name: "Premier League",
      logo: "/images/premierLeagueLogo.png",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      clubCount: 24,
      lastActivity: "Today, May 10th",
      createdAt: "May 2, 2025",
      memberCount: "225k",
    };

    const user = {
      username: "username",
      profileImage: "/images/blankProfile.png",
    };

    const relatedLeagues = [
      {
        id: "1",
        name: "Bundesliga",
        logo: "/images/bundesligaLogo.png",
      },
      {
        id: "2",
        name: "La Liga",
        logo: "/images/laLigaLogo.png",
      },
    ];

    res.json({
      status: "success",
      clubs,
      league,
      relatedLeagues,
      user,
    });
  } catch (error) {
    console.error("Error in clubs controller:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
};
