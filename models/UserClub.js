module.exports = (sequelize, DataTypes) => {
  const UserClub = sequelize.define(
    "UserClub",
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
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      ClubId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Clubs", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true,
    }
  );
  return UserClub;
};
