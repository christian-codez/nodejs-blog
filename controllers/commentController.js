const { asyncMiddleware } = require('../middlewares/asyncMiddleware')
const { Post } = require("../models/post");

exports.index = asyncMiddleware(async(req, res) => {
    const comments = await Post.getComments(req);
    if (comments.length <= 0) return res.status(400).send("Oops! No comment was found.")
    res.send(comments);
});

exports.create = asyncMiddleware(async(req, res) => {
    const post = await Post.saveComment(req);
    if (!post) return res.status(400).send("Oops! Comment could not be saved.")
    res.send(post);
});

exports.update = asyncMiddleware(async(req, res) => {
    const comment = await Post.updateComments(req);
    if (!comment) return res.status(400).send("Oops! Comment could not be updated.")
    res.send(comment);
});

exports.delete = asyncMiddleware(async(req, res) => {
    const comment = await Post.updateComments(req);
    if (comment.nModified !== 1) return res.status(400).send("Oops! Comment could not be deleted.")
    res.send(comment);
});