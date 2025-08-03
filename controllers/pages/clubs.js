const getLeague = require("../../utils/getLeague");
const getClubsByLeague = require("../../utils/getClubsByLeague");

module.exports = async (req, res) => {
  try {
    const { league: leagueId } = req.query;

    const clubs = await getClubsByLeague(leagueId);

    const league = await getLeague(leagueId);

    const relatedLeagues = await require("../../utils/getLeagues")({
      limit: 3,
      excludeLeagueIds: [leagueId],
    });

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
