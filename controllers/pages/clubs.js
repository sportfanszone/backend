const getLeague = require("../../utils/getLeague");
const getClubsByLeague = require("../../utils/getClubsByLeague");
const getLeagues = require("../../utils/getLeagues");
const { League } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { league: leagueId } = req.query;

    const clubs = await getClubsByLeague(leagueId);
    console.log(clubs);

    // const clubs = [
    //   {
    //     id: 1,
    //     name: "Manchester City",
    //     topicCount: 142,
    //     lastActivity: "Today, 09:14",
    //     description:
    //       "The most competitive football club in the world, featuring top English clubs.",
    //     logo: "/images/manchesterCityLogo.png",
    //     backgroundImage: "/images/manchesterCityBackgroundImage.png",
    //   },
    //   {
    //     id: 2,
    //     name: "Arsenal",
    //     topicCount: 95,
    //     lastActivity: "Yesterday, 22:08",
    //     description:
    //       "Spain’s top-tier club, known for its flair, rivalries, and legendary players.",
    //     logo: "/images/arsenalLogo.png",
    //     backgroundImage: "/images/arsenalBackgroundImage.png",
    //   },
    //   {
    //     id: 3,
    //     name: "Liverpool",
    //     topicCount: 110,
    //     lastActivity: "Today, 06:45",
    //     description:
    //       "Germany’s premier club, combining strong fan culture and attacking football.",
    //     logo: "/images/liverpool.png",
    //     backgroundImage: "/images/liverpoolBackgroundImage.png",
    //   },
    //   {
    //     id: 4,
    //     name: "Chelsea",
    //     topicCount: 87,
    //     lastActivity: "2 days ago, 18:33",
    //     description:
    //       "Italy’s historic club, home to tactical brilliance and legendary defenders.",
    //     logo: "/images/chelsea.png",
    //     backgroundImage: "/images/chelseaBackgroundImage.png",
    //   },
    //   {
    //     id: 5,
    //     name: "Manchester United",
    //     topicCount: 74,
    //     lastActivity: "Today, 11:01",
    //     description:
    //       "France’s top club, spotlighting young talents and dominant PSG performances.",
    //     logo: "/images/manchesterUnited.png",
    //     backgroundImage: "/images/manchesterUnitedBackgroundImage.png",
    //   },
    //   {
    //     id: 6,
    //     name: "Tottenham Hotspur",
    //     topicCount: 63,
    //     lastActivity: "Yesterday, 20:17",
    //     description:
    //       "North America’s growing club, blending global stars and rising talents.",
    //     logo: "/images/tottenhamHotspur.png",
    //     backgroundImage: "/images/tottenhamHotspurBackgroundImage.png",
    //   },
    // ];

    const league = await getLeague(leagueId);

    const relatedLeagues = await League.findAll({ limit: 2 });

    res.json({
      status: "success",
      clubs,
      league,
      relatedLeagues,
    });
  } catch (error) {
    console.error("Error in clubs controller:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
};
