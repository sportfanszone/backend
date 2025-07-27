const { Club } = require("../models");

module.exports = async (req, res) => {
  try {
    const clubs = await Club.findAll();

    res.status(200).json({
      status: "success",
      clubs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
