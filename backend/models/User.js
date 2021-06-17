require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("groupomania", `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    dialect: "mysql",
    host: "localhost"
});

const User = sequelize.define("user", {
  Username: {
  	type: DataTypes.STRING,
  	allowNull: false
  },
  Email: {
  	type: DataTypes.STRING,
  	allowNull: false,
  	unique: 'true'
  },
  Passeword: {
  	type: DataTypes.STRING,
  	allowNull: false
  },
  Biography: {
  	type: DataTypes.TEXT,
  	allowNull: true
  },
  Mail_visible: {
  	type: DataTypes.INTEGER,
  	allowNull: false,
  	defaultValue: 1
  },
  role_id: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  	defaultValue: 1
  },
  Image: {
  	type: DataTypes.STRING,
  	allowNull: true
  },
  Date: {
  	type: DataTypes.DATE,
  	defaultValue: Sequelize.NOW
  },
  Sex: {
  	type: DataTypes.INTEGER,
  	allowNull: false
  }
}, {
  tableName: 'User'
});

(async () => {
  await sequelize.sync();
  console.log("Model créé pour USER")
})();