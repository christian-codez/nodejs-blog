const { asyncMiddleware } = require('../middlewares/asyncMiddleware')
const { Post } = require("../models/post");
const { validateUpdateComment } = require("../validations/comment-validation");

exports.index = asyncMiddleware(async(req, res) => {
    const comments = await Post.getComments(req);
    if (comments.length <= 0) return res.status(400).send("Oops! No comment was found.")
    res.send(comments);
});

exports.create = asyncMiddleware(async(req, res) => {
    //validate the input sent
    const { error } = validateUpdateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const post = await Post.saveComment(req);

    res.send(post);
});

exports.update = asyncMiddleware(async(req, res) => {
    const comment = await Post.updateComments(req);

    res.send(comment);
});

exports.delete = asyncMiddleware(async(req, res) => {
    const comment = await Post.deleteComments(req);

    res.send(comment);
});