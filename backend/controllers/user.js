const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const xss = require('xss');
const db = require("../models")
const User = db.users
const Role = db.roles

const schemaPassValid = new passwordValidator();

schemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

exports.signup = (req, res, next) => {
  db.roles.create({ name : "employé" })

  if (!schemaPassValid.validate(req.body.password)) {
    res.status(401).json({message:"Sécurité du mot de passe faible. Il doit contenir au moins 8 caractère, des majuscules et deux chiffres"})
  }

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = {
        username: xss(req.body.username),
        email: xss(req.body.email),
        password: hash,
        sex: xss(req.body.sex),
        role_id : 1
      };

      User.create(user)
        .then(data => {
          res.status(201).json({ message: 'Utilisateur créé !' })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/*exports.login = (req, res, next) => {
  const id = req.params.id;
  console.log(req)
};*/