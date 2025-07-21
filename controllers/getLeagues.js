const { League } = require("../models");

module.exports = async (req, res) => {
  console.log("----Fetching leagues...");
  try {
    const leagues = await League.findAll();

    console.log("----Leagues fetched successfully:");
    console.log(leagues);
    res.status(200).json({
      status: "success",
      leagues,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
