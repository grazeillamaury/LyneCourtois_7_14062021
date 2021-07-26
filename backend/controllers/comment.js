const fs = require('fs')
const xss = require('xss')
const db = require("../models")
const Comment = db.comments

exports.createComment = (req, res, next) => {
	const commentObject = JSON.parse(req.body.content);

  const comment = {
    content: xss(commentObject.text),
    userId: xss(commentObject.userid),
    postId : req.params.post_id
  }

  Comment.create(comment)
    .then(data => {
      res.status(201).json({ message: 'Commentaire créé !' })
    })
    .catch(error => res.status(500).json({ error }));
};