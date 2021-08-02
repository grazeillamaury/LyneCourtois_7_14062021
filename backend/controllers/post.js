const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Post = db.posts
const User = db.users
const Comment = db.comments

exports.createPost = (req, res, next) => {
	const postObject = JSON.parse(req.body.content);

  const post = {
    content: xss(postObject.text),
    image : "",
    userId: xss(postObject.userid)
  };

  if (req.file) {
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  Post.create(post)
    .then(data => {
      res.status(201).json({ message: 'Post créé !' })
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllPost = (req, res, next) => {
  Post.findAll({
    include: [
      { 
        model : Comment,
        as: 'comments',
        include : [ "user"]
      },
      "user"
    ],
    order: [
      ['date', 'DESC'],
      ['comments','date', 'ASC']
    ]
  }, { limit: 50 })
  .then((posts) => {
    res.status(200).json(posts);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllPostFromOneUser = (req, res, next) => {
  const id = req.params.userId;

  console.log(id)

  User.findByPk(id, {
    include: [
      { 
        model : Post,
        as: 'posts',
        include: [
          { 
            model : Comment,
            as: 'comments',
            include : [ "user"]
          },
        ],
      },
    ],
    order: [
      ['posts', 'date', 'DESC'],
      ['posts', 'comments','date', 'ASC']
    ]
  })
  .then((post) => {
    res.status(200).json(post);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOnePost = (req, res, next) => {
  const id = req.params.id;

  Post.findByPk(id, {
    include: [
      { 
        model : Comment,
        as: 'comments',
        include : [ "user"]
      },
      "user"
    ],
    order: [['comments','date', 'ASC']]
  })
  .then((post) => {
    res.status(200).json(post);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifyPost = (req, res, next) => {
  const id = req.params.id;
  const post = {};

  if (req.body.content) {
    const postObject = JSON.parse(req.body.content);
    post.content = xss(postObject.text)
  }

  if (req.file) {
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  console.log(post)

  if (req.file){
    Post.findByPk(id)
      .then((oldpost) => {
        if(!post.content){
          post.content = oldpost.content
        }

        if(oldpost.image){
          console.log("Il y a un fichier et le post de base en a un aussi")
          const filename = oldpost.image.split('/images/')[1];

          fs.unlink(`images/${filename}`, () => {
            Post.update(post, { where: { id: id }})
            .then(data => {
              console.log(data)
              res.status(201).json({ message: 'Post modifié !' })
            })
            .catch(error => res.status(500).json({ error }));
          });
        }else{
          console.log("Il y a un fichier mais le post de base en n'a pas")
          Post.update(post, { where: { id: id }})
          .then(data => {
            console.log(data)
            res.status(201).json({ message: 'Post modifié !' })
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
    console.log("pas de ficher")
    Post.update(post, { where: { id: id }})
    .then(data => {
      res.status(201).json({ message: 'Post modifié !' })
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Post.findByPk(id)
  .then((post) => {
    console.log(post.image)
    if (post.image != null) {
      const filename = post.image.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id : id }})
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
    }else{
      Post.destroy({ where: { id : id }})
      .then(() => res.status(200).json({ message: 'Post supprimé !'}))
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
};