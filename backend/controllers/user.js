const db = require("../models")
const User = db.users
const Role = db.roles

exports.signup = (req, res, next) => {
  db.roles.create({ name : "employé" })

  console.log(req.body)

  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    sex: req.body.sex,
    role_id : 1
  };

  console.log(user)

  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};