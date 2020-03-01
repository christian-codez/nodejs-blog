const { asyncMiddleware } = require('../middlewares/asyncMiddleware');
const { validateNewPost, validateUpdatedPost } = require("../validations/post-validation");
const { Post } = require("../models/post");
const mongoose = require('mongoose')
const status = require('http-status');

exports.index = asyncMiddleware(async(req, res) => {
    const posts = await Post.getAll(req);
    if (!posts || posts.length <= 0) return res.status(status.NOT_FOUND).send("Oops! No record was found.");

    res.send(posts);
});

exports.postByUser = asyncMiddleware(async(req, res) => {
    const posts = await Post.postByUser(req);
    if (!posts || posts.length <= 0) return res.status(status.NOT_FOUND).send("Oops! No posts were founf for this user.");

    res.send(posts);
});

exports.search = asyncMiddleware(async(req, res) => {

    if (undefined === req.query.s) return res.status(status.BAD_REQUEST).send(`Oops! please provide a search keyword`);

    const post = await Post.searchPost(req);
    if (!post || post.length <= 0) return res.status(status.NOT_FOUND).send(`Oops! No record was found for the "${req.query.s}"`);

    res.send(post);
});
exports.create = asyncMiddleware(async(req, res) => {
    //validate user request
    const { error } = validateNewPost(req.body);
    if (error) return res.status(status.BAD_REQUEST).send(error.details[0].message);

    const newPost = await Post.createPost(req);
    if (!newPost) return res.status(status.BAD_REQUEST).send("Oops! post was not created.");

    res.status(status.CREATED).send(newPost);
});
exports.update = asyncMiddleware(async(req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(status.BAD_REQUEST).send("Please provide a valid Post ID")

    //validate user request
    const { error } = validateUpdatedPost(req.body);
    if (error) return res.status(status.BAD_REQUEST).send(error.details[0].message);

    const post = await Post.updatePost(req);
    if (!post) return res.status(status.BAD_REQUEST).send("Oops! post could not be updated.");

    res.send(post);
});
exports.delete = asyncMiddleware(async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(status.BAD_REQUEST).send("Please provide a valid Post ID")

    const post = await Post.deletePost(req);
    if (!post.deletedCount) return res.status(status.BAD_REQUEST).send("Oops! post was not successfully deleted.");

    res.send(post);
});