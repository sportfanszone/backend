module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    PostId: {
      type: DataTypes.UUID,
      allowNull: true,
      validate: { notEmpty: false },
    },
    ParentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
  });

  return Comment;
};
