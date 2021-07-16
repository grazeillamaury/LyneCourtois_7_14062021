const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Post = db.posts

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