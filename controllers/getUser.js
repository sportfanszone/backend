const { User } = require("../models");

module.exports = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
