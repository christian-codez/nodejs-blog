const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    comment: { type: String, trim: true },
    created: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema]
}, {
    timestamps: true
});


postSchema.statics.createPost = async function(req) {
    const post = Post({
        'title': req.body.title,
        'content': req.body.content,
        'author': req.user.id
    });
    return await post.save()
}

postSchema.statics.getAll = async function(req) {

    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    return await this.find()
        .limit(parseInt(req.query.limit))
        .skip((parseInt(req.query.page) * parseInt(req.query.limit)) - parseInt(req.query.limit))
        .sort(sort);
}

postSchema.statics.postByUser = async function(req) {
    //return await this.populate('user').where({ author: req.params.userId }).execPopulate();
    return await this.find({ author: req.params.userId }).populate('author');
}

postSchema.statics.updatePost = async function(req) {
    //update the user account
    return await this.findOneAndUpdate({ _id: req.params.id }, {
        "title": req.body.title,
        "content": req.body.content
    }, { new: true });
};

postSchema.statics.deletePost = async function(req) {
    return await this.deleteOne({ _id: req.params.id, author: req.user.id });
}


postSchema.statics.searchPost = function(req) {
    return this.find({
        $or: [
            { 'title': { $regex: req.query.s, $options: 'i' } }, { 'content': { $regex: req.query.s, $options: 'i' } }
        ]
    });
}

postSchema.statics.saveComment = async function(req) {
    const postId = req.params.post_id;
    return await this.findOneAndUpdate({ "_id": postId }, {
        $push: {
            comments: {
                comment: req.body.comment,
                user: req.user.id
            }
        }
    }, { new: true });
}

postSchema.statics.getComments = async function(req) {
    return await this.find({ _id: req.params.post_id }).select("-_id comments");
}

postSchema.statics.updateComments = async function(req) {
    return await this.updateOne({ _id: req.params.post_id, "comments._id": req.params.comment_id }, { $set: { "comments.$.comment": req.body.comment } })
}

postSchema.statics.deleteComments = async function(req) {
    return await this.update({ "_id": req.params.post_id }, { $pull: { 'comments': { _id: req.params.comment_id } } })
}

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };