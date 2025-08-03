const { User } = require("../models");
const { Op } = require("sequelize");

// Function to get all users with optional filtering, sorting, pagination, and exclusion
async function getAllUsers(options = {}) {
  try {
    // Destructure options with default values
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

    // Combine the provided where clause with exclusion of specific user IDs
    const finalWhere = {
      ...where,
      id: {
        [Op.notIn]: excludeUserIds,
      },
    };

    // Fetch users with the provided options
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
