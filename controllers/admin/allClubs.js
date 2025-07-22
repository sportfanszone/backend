const { Club } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.substring]: search } },
            { description: { [Op.substring]: search } },
            { logo: { [Op.substring]: search } },
            { backgroundImage: { [Op.substring]: search } },
            { lastAccess: { [Op.substring]: search } },
          ],
        }
      : {};

    const { rows: clubs, count } = await Club.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "description",
        "logo",
        "backgroundImage",
        "lastAccess",
        "createdAt",
      ],
    });

    res.json({
      clubs,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
