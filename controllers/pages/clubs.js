const getLeague = require("../../utils/getLeague");
const getClubsByLeague = require("../../utils/getClubsByLeague");
const { League } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { league: leagueId } = req.query;

    const clubs = await getClubsByLeague(leagueId);

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
