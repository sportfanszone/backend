module.exports = async (req, res) => {
  try {
    res.json({
      leagues: [
        {
          id: 1,
          leagueName: "Premier League",
          topics: 142,
          lastActivity: "Today, 09:14",
          description:
            "The most competitive football league in the world, featuring top English clubs.",
          logo: "/images/premierLeagueLogo.png",
          backgroundImage: "/images/premierLeagueBackground.png",
        },
        {
          id: 2,
          leagueName: "La Liga",
          topics: 95,
          lastActivity: "Yesterday, 22:08",
          description:
            "Spain’s top-tier league, known for its flair, rivalries, and legendary players.",
          logo: "/images/laLigaLogo.png",
          backgroundImage: "/images/laLigaBackgroundImage.png",
        },
        {
          id: 3,
          leagueName: "Bundesliga",
          topics: 110,
          lastActivity: "Today, 06:45",
          description:
            "Germany’s premier league, combining strong fan culture and attacking football.",
          logo: "/images/bundesligaLogo.png",
          backgroundImage: "/images/bundesligaBackgroundImage.png",
        },
        {
          id: 4,
          leagueName: "Serie A",
          topics: 87,
          lastActivity: "2 days ago, 18:33",
          description:
            "Italy’s historic league, home to tactical brilliance and legendary defenders.",
          logo: "/images/serieALogo.png",
          backgroundImage: "/images/serieABackgroundImage.png",
        },
        {
          id: 5,
          leagueName: "Ligue 1",
          topics: 74,
          lastActivity: "Today, 11:01",
          description:
            "France’s top league, spotlighting young talents and dominant PSG performances.",
          logo: "/images/ligue1Logo.png",
          backgroundImage: "/images/ligue1BackgroundImage.png",
        },
        {
          id: 6,
          leagueName: "Major League Soccer",
          topics: 63,
          lastActivity: "Yesterday, 20:17",
          description:
            "North America’s growing league, blending global stars and rising talents.",
          logo: "/images/mlsLogo.png",
          backgroundImage: "/images/majorLeagueSoccerBackgroundImage.png",
        },
      ],
      status: "success",
    });
  } catch (error) {
    console.error("Error in getLeagues controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
