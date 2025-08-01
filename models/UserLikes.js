module.exports = (sequelize, DataTypes) => {
  const UserLikes = sequelize.define("UserLikes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
      references: { model: "Users", key: "id" },
    },
    PostId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Posts", key: "id" },
    },
    CommentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Comments", key: "id" },
    },
  });

  return UserLikes;
};
