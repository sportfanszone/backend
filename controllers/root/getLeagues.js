const getLeagues = require("../../utils/getLeagues");

module.exports = async (req, res) => {
  try {
    const pinned = req.query?.pinned === "true" ? true : false;
    const leagues = await getLeagues({ where: pinned ? { pinned } : {} });
    const clubs = await require("../../utils/getClubs")({ limit: 5 });

    res.json({
      leagues,
      clubs,
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
