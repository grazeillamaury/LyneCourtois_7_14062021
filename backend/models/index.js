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

db.users.belongsTo(db.roles, {
  foreignKey: "role_id",
  as: "role",
});

module.exports = db;
