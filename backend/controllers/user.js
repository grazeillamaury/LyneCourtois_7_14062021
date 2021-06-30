const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
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
  Role.create({ name : "employé" })

  if (!schemaPassValid.validate(req.body.password)) {
    return res.status(401).json({ error: 'Sécurité du mot de passe faible. Il doit contenir au moins 8 caractère, des majuscules et deux chiffres' })
  }

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = {
        username: xss(req.body.username),
        email: xss(req.body.email),
        password: hash,
        sex: xss(req.body.sex),
        roleId : 1
      };

      User.create(user)
        .then(data => {
          res.status(201).json({ message: 'Utilisateur créé !' })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  let loginEmail = xss(req.body.email)
  let loginPassword = req.body.password

  User.findAll({ where: { email: loginEmail } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }

      bcrypt.compare(loginPassword, user[0].password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user[0].id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};