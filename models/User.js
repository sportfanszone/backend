module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      googleId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: false,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/images/blankProfile.png",
        validate: {
          notEmpty: false,
        },
      },
      coverPhotoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/images/heroBackground.jpg",
        validate: {
          notEmpty: false,
        },
      },
      role: {
        type: DataTypes.ENUM(["user", "admin"]),
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM(["blocked", "active"]),
        allowNull: false,
        defaultValue: "active",
        validate: {
          notEmpty: true,
        },
      },
      lastAccess: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: true,
    }
  );
  return User;
};
