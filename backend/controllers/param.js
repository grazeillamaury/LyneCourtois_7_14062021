const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Param = db.users

const schemaPassValid = new passwordValidator();

schemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

exports.getOneUserParam = (req, res, next) => {
  const id = req.params.id;

  Param.findByPk(id)
  .then((userParam) => {
    res.status(200).json(userParam);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifyParam = (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const paramObject = JSON.parse(req.body.content);

  const param = {
    username : xss(paramObject.username),
    email : xss(paramObject.email)
  };

  if (req.file) {
    param.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  if (req.file){
    Param.findByPk(id)
      .then((oldUser) => {

        if(oldUser.image){
          const filename = oldUser.image.split('/images/')[1];
          console.log(filename)

          fs.unlink(`images/${filename}`, () => {
            console.log(param)
            Param.update(param, { where: { id: id }})
            .then(data => {
              res.status(201).json({ message: 'Utilisateur modifié !' })
            })
            .catch(error => res.status(500).json({ error }));
          });
        }else{
          Param.update(param, { where: { id: id }})
          .then(data => {
            res.status(201).json({ message: 'Utilisateur modifié !' })
          })
          .catch(error => res.status(500).json({ error }));
        }
      })
      .catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      ); 
  }else{
    Param.update(param, { where: { id: id }})
    .then(data => {
      res.status(201).json({ message: 'Utilisateur modifié !' })
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.modifyPassword = (req, res, next) => {
  const id = req.params.id;
  const passwords = JSON.parse(req.body.content)
  const oldpassword = passwords.oldpassword
  const newpassword = passwords.newpassword

  Param.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }

      bcrypt.compare(oldpassword, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe d'origine incorrect !" });
          }

          bcrypt.hash(newpassword, 10)
          .then(hash => {
            const password = {
              password : hash
            };

            console.log(password)

            Param.update(password, { where: { id: id }})
            .then(data => {
              res.status(201).json({ message: 'Mot de passe modifié !' })
            })
            .catch(error => res.status(500).json({ error }));

          })
          .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));









  /*const pass = {
    content : xss(commentObject.text)
  };

  console.log(id, passwordObject)

  Comment.update(comment, { where: { id: id }})
    .then(data => {
      res.status(201).json({ message: 'Commentaire modifié !' })
    })
    .catch(error => res.status(500).json({ error }));*/
};

/*exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  Comment.destroy({ where: { id : id }})
    .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
    .catch(error => res.status(400).json({ error }));
};*/