const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./User.js");
const League = require("./League");
const Club = require("./Club");
const ActivityLog = require("./ActivityLog");
const Follow = require("./Follow");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    connectTimeout: 100000,
  },
  pool: {
    min: dbConfig.pool.min,
    max: dbConfig.pool.max,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// DBs
db.User = User(sequelize, DataTypes);
db.League = League(sequelize, DataTypes);
db.Club = Club(sequelize, DataTypes);
db.ActivityLog = ActivityLog(sequelize, DataTypes);
db.Follow = Follow(sequelize, DataTypes);

// Associations
db.User.belongsTo(db.Club);
db.Club.hasMany(db.User);

db.ActivityLog.belongsTo(db.User);
db.User.hasMany(db.ActivityLog);

db.Club.belongsTo(db.League);
db.League.hasMany(db.Club);

db.User.belongsToMany(db.User, {
  as: "Following",
  through: db.Follow,
  foreignKey: "followerId",
  otherKey: "followingId",
});

db.User.belongsToMany(db.User, {
  as: "Followers",
  through: db.Follow,
  foreignKey: "followingId",
  otherKey: "followerId",
});

module.exports = db;
