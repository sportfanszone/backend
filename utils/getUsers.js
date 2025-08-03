const { User } = require("../models");
const { Op } = require("sequelize");

async function getAllUsers(options = {}) {
  try {
    const {
      where = {},
      attributes = [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
        "profileImageUrl",
        "role",
        "status",
      ],
      order = [["createdAt", "DESC"]],
      limit = 10,
      offset = 0,
      include = [],
      excludeUserIds = [],
    } = options;

    const finalWhere = {
      ...where,
      id: {
        [Op.notIn]: excludeUserIds,
      },
    };

    const users = await User.findAll({
      where: finalWhere,
      attributes,
      order,
      limit,
      offset,
      include,
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

module.exports = getAllUsers;
