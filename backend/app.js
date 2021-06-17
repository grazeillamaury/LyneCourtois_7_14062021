require('dotenv').config()
const express = require('express');
const helmet = require("helmet");
const userRoutes = require('./routes/user');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("groupomania", `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    dialect: "mysql",
    host: "localhost"
});

try {
   sequelize.authenticate();
   console.log('Connecté à la base de données MySQL!');
 } catch (error) {
   console.error('Impossible de se connecter, erreur suivante :', error);
 }

const app = express();
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use('/api/auth', userRoutes);
module.exports = app;