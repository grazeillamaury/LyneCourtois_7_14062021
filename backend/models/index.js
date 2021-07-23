require('dotenv').config()
const Sequelize = require("sequelize");
const sequelize = new Sequelize("groupomania", `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    dialect: "mysql",
    host: "localhost"
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roles = require("./Role.js")(sequelize, Sequelize);
db.users = require("./User.js")(sequelize, Sequelize);
db.posts = require("./Post.js")(sequelize, Sequelize);
db.comments = require("./Comment.js")(sequelize, Sequelize);

//clés étrangères de Users

db.roles.hasMany(db.users, { as: "users" });
db.users.belongsTo(db.roles, {
  foreignKey: "roleId",
  as: "role",
});

//clés étrangères de Posts

db.users.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.posts.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post",
  allowNull: true
});

//clés étrangères de Comments

db.users.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.posts.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post",
});

module.exports = db;
