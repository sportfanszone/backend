module.exports = (sequelize, DataTypes) => {
  const PendingSignup = sequelize.define(
    "PendingSignup",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otpExpires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userData: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    { timestamps: true }
  );
  return PendingSignup;
};
