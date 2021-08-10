const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Param = db.users
const Post = db.posts

const schemaPassValid = new passwordValidator();

schemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

exports.getAllUsers = (req, res, next) => {
  //get all users
  Param.findAll()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

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
  //Init info
  const id = req.params.id;
  const paramObject = JSON.parse(req.body.content);

  const param = {
    username : xss(paramObject.username),
    email : xss(paramObject.email),
    biography : xss(paramObject.biography)
  };

  if (req.file) {
    param.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  //if image =>
  if (req.file){

    //Get one User
    Param.findByPk(id)
      .then((oldUser) => {
        if(oldUser.image){

          //delete original image
          const filename = oldUser.image.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {

            //change param
            Param.update(param, { where: { id: id }})
            .then(data => {
              res.status(201).json({ message: 'Utilisateur modifié !', newImage: param.image})
            })
            .catch(error => res.status(500).json({ error }));
          });
        }else{

          //change param if no image
          Param.update(param, { where: { id: id }})
          .then(data => {
            res.status(201).json({ message: 'Utilisateur modifié !', newImage: param.image})
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
  }
  //if not =>
  else{
    Param.update(param, { where: { id: id }})
    .then(data => {
      res.status(201).json({ message: 'Utilisateur modifié !' })
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.modifyPassword = (req, res, next) => {
  //Init all data
  const id = req.params.id;
  const passwords = req.body
  const oldpassword = passwords.oldpassword
  const newpassword = passwords.newpassword

  //Get on user
  Param.findByPk(id)
    .then(user => {

      //Compare Passwords
      bcrypt.compare(oldpassword, user.password)
        .then(valid => {

          //if not the same
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe d'origine incorrect !" });
          }

          //if not valid
          if (!schemaPassValid.validate(newpassword)) {
            return res.status(401).json({ error: 'Sécurité du mot de passe faible. Il doit contenir au moins 8 caractère, des majuscules et deux chiffres' })
          }

          //Init New password
          bcrypt.hash(newpassword, 10)
          .then(hash => {
            const password = {
              password : hash
            };

            //Send data to BDD
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
};

exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  //Get all post from one user
  Post.findAll({ where: { userId: id } })
  .then((posts) => {

    //Delete Post and image
    posts.forEach(post =>{

      //Delete if image
      if (post.image != "") {
        const filename = post.image.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.destroy({ where: { id : post.id }})
          .catch(error => res.status(400).json({ error }));
        });

      //Delete if no image
      }else{
        Post.destroy({ where: { id : post.id }})
        .catch(error => res.status(400).json({ error }));
      }
    })

    //Get one user
    Param.findByPk(id)
    .then((user) => {

      //Delete if image
      if (user.image != null) {
        const filename = user.image.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Param.destroy({ where: { id : id }})
          .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        });

      //Delete if no image
      }else{
        Param.destroy({ where: { id : id }})
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};