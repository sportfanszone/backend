const { User } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          [Op.or]: [
            { firstName: { [Op.substring]: search } },
            { lastName: { [Op.substring]: search } },
            { username: { [Op.substring]: search } },
            { email: { [Op.substring]: search } },
            { status: { [Op.substring]: search } },
            { role: { [Op.substring]: search } },
          ],
        }
      : {};

    const { rows: users, count } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
        "status",
        "role",
        "profileImageUrl",
        "createdAt",
        "lastAccess",
      ],
    });

    res.json({
      users,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
