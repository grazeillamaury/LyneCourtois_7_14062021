const fs = require('fs')
const jwt = require('jsonwebtoken')
const xss = require('xss')
const db = require("../models")
const Post = db.post

exports.createPost = (req, res, next) => {
	const postObject = req.body.post
	console.log(postObject)
	const post = {
        content: xss(postObject.content),
        userId: xss(postObject.user)
      };

      Post.create(post)
      .then(data => {
      	res.status(201).json({ message: 'Utilisateur créé !' })
      })
      .catch(error => res.status(500).json({ error }));
};