const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Post = db.posts
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
    order: [['date', 'DESC']] },
    { limit: 50 })
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

exports.getOnePost = (req, res, next) => {
  const id = req.params.id;

  Post.findByPk(id, {
    include: [ { 
      model : Comment,
      requierd: true,
      as: 'comments',
      include : [ "user"]
    }, "user"],
    order: [['date', 'DESC']] },
    { limit: 20 }).
  then((posts) => {
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
