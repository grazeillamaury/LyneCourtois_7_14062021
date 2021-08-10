const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Post = db.posts
const User = db.users
const Comment = db.comments

exports.createPost = (req, res, next) => {
  //Init info
	const postObject = JSON.parse(req.body.content);

  const post = {
    content: xss(postObject.text),
    image : "",
    userId: xss(postObject.userid)
  };

  if (req.file) {
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  //create new post
  Post.create(post)
    .then(data => {
      res.status(201).json({ message: 'Post créé !' })
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllPost = (req, res, next) => {
  //get all posts with the created user and comments with their users
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

  //get all posts from one user and comments with their users
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

  //get one post with the created user and comments with their users
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
  //init info
  const id = req.params.id;
  const post = {};

  if (req.body.content) {
    const postObject = JSON.parse(req.body.content);
    post.content = xss(postObject.text)
  }

  if (req.file) {
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  //if image =>
  if (req.file){

    //get one post
    Post.findByPk(id)
      .then((oldpost) => {

        //if no content's post edit
        if(!post.content){
          post.content = oldpost.content
        }

        //if there is an original image
        if(oldpost.image){

          //delete original image
          const filename = oldpost.image.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {

            //edit post
            Post.update(post, { where: { id: id }})
            .then(data => {
              res.status(201).json({ message: 'Post modifié !' })
            })
            .catch(error => res.status(500).json({ error }));
          });

        //if no original image
        }else{

          //edit post
          Post.update(post, { where: { id: id }})
          .then(data => {
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
  }
  //if not image => edit post
  else{
    Post.update(post, { where: { id: id }})
    .then(data => {
      res.status(201).json({ message: 'Post modifié !' })
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  //find one post
  Post.findByPk(id)
  .then((post) => {

    //if there is an original image =>
    if (post.image) {

      //delete original image
      const filename = post.image.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {

        //delete post
        Post.destroy({ where: { id : id }})
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });

    //if no original image => delete post
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