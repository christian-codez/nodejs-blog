const { asyncMiddleware } = require('../middlewares/asyncMiddleware');
const { validateNewPost, validateUpdatedPost } = require("../validations/post-validation");
const { Post } = require("../models/post");

exports.index = asyncMiddleware(async(req, res) => {
    const posts = await Post.getAll();
    if (!posts) return res.status(400).send("Oops! No record was found.");

    res.send(posts);
});

exports.search = asyncMiddleware(async(req, res) => {

    const keyword = req.query.s;
    if (undefined === keyword) return res.status(400).send(`Oops! please provide a search keyword`);

    const post = await Post.find({
        $or: [
            { 'title': { $regex: keyword, $options: 'i' } }, { 'content': { $regex: keyword, $options: 'i' } }
        ]
    });
    if (!post || post.length <= 0) return res.status(404).send(`Oops! No record was found for the "${keyword}"`);

    res.send(post);
});
exports.create = asyncMiddleware(async(req, res) => {
    //validate user request
    const { error } = validateNewPost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newPost = await Post.createPost(req);
    if (!newPost) return res.status(400).send("Oops! post was not created.");

    res.send(newPost);
});
exports.update = asyncMiddleware(async(req, res) => {
    //validate user request
    const { error } = validateUpdatedPost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const post = await Post.updatePost(req);
    if (!post) return res.status(400).send("Oops! post could not be updated.");

    res.send(post);
});
exports.delete = asyncMiddleware(async(req, res) => {
    const post = await Post.deletePost(req);
    if (!post) return res.status(400).send("Oops! post was not successfully deleted.");

    res.send(post);
});