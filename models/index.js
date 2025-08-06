const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./User.js");
const League = require("./League");
const Club = require("./Club");
const ActivityLog = require("./ActivityLog");
const Follow = require("./Follow");
const Post = require("./Post");
const PostFile = require("./PostFile");
const Comment = require("./Comment");
const UserLikes = require("./UserLikes");
const PendingSignup = require("./PendingSignup");

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

// Initialize models
db.User = User(sequelize, DataTypes);
db.League = League(sequelize, DataTypes);
db.Club = Club(sequelize, DataTypes);
db.ActivityLog = ActivityLog(sequelize, DataTypes);
db.Follow = Follow(sequelize, DataTypes);
db.Post = Post(sequelize, DataTypes);
db.PostFile = PostFile(sequelize, DataTypes);
db.Comment = Comment(sequelize, DataTypes);
db.UserLikes = UserLikes(sequelize, DataTypes);
db.PendingSignup = PendingSignup(sequelize, DataTypes);

// Associations with CASCADE where appropriate
db.User.belongsTo(db.Club, { foreignKey: "ClubId", onDelete: "SET NULL" });
db.Club.hasMany(db.User, { foreignKey: "ClubId", onDelete: "CASCADE" });

db.ActivityLog.belongsTo(db.User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});
db.User.hasMany(db.ActivityLog, { foreignKey: "UserId", onDelete: "CASCADE" });

db.Club.belongsTo(db.League, { foreignKey: "LeagueId", onDelete: "SET NULL" });
db.League.hasMany(db.Club, {
  as: "Clubs",
  foreignKey: "LeagueId",
  onDelete: "CASCADE",
});

db.User.belongsToMany(db.User, {
  as: "Following",
  through: db.Follow,
  foreignKey: "followerId",
  otherKey: "followingId",
  onDelete: "CASCADE",
});

db.User.belongsToMany(db.User, {
  as: "Followers",
  through: db.Follow,
  foreignKey: "followingId",
  otherKey: "followerId",
  onDelete: "CASCADE",
});

db.User.hasMany(db.Post, {
  foreignKey: "UserId",
  as: "Posts",
  onDelete: "CASCADE",
});
db.Post.belongsTo(db.User, {
  foreignKey: "UserId",
  as: "User",
  onDelete: "CASCADE",
});

db.Post.belongsTo(db.Club, {
  foreignKey: "ClubId",
  as: "Club",
  onDelete: "SET NULL",
});
db.Club.hasMany(db.Post, {
  foreignKey: "ClubId",
  as: "Posts",
  onDelete: "CASCADE",
});

db.Post.hasMany(db.PostFile, {
  foreignKey: "PostId",
  as: "PostFiles",
  onDelete: "CASCADE",
});
db.PostFile.belongsTo(db.Post, { foreignKey: "PostId", onDelete: "CASCADE" });

db.Comment.belongsTo(db.User, {
  foreignKey: "UserId",
  as: "User",
  onDelete: "CASCADE",
});
db.User.hasMany(db.Comment, {
  foreignKey: "UserId",
  as: "Comments",
  onDelete: "CASCADE",
});

db.Comment.belongsTo(db.Post, {
  foreignKey: "PostId",
  as: "Post",
  onDelete: "CASCADE",
});
db.Post.hasMany(db.Comment, {
  foreignKey: "PostId",
  as: "Comments",
  onDelete: "CASCADE",
});

db.Comment.belongsTo(db.Comment, {
  foreignKey: "ParentCommentId",
  as: "Parent",
  onDelete: "CASCADE",
});
db.Comment.hasMany(db.Comment, {
  foreignKey: "ParentCommentId",
  as: "Replies",
  onDelete: "CASCADE",
});

db.User.hasMany(db.UserLikes, {
  foreignKey: "userId",
  as: "UserLikes",
  onDelete: "CASCADE",
});
db.UserLikes.belongsTo(db.User, {
  foreignKey: "userId",
  as: "User",
  onDelete: "CASCADE",
});

db.Post.hasMany(db.UserLikes, {
  foreignKey: "PostId",
  as: "UserLikes",
  onDelete: "CASCADE",
});
db.UserLikes.belongsTo(db.Post, {
  foreignKey: "PostId",
  as: "Post",
  onDelete: "CASCADE",
});

db.Comment.hasMany(db.UserLikes, {
  foreignKey: "CommentId",
  as: "UserLikes",
  onDelete: "CASCADE",
});
db.UserLikes.belongsTo(db.Comment, {
  foreignKey: "CommentId",
  as: "Comment",
  onDelete: "CASCADE",
});

module.exports = db;
