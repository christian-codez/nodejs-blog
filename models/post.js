const mongoose = require('mongoose');

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
    comments: {
        type: Array,
    }
});


postSchema.statics.createPost = async function(req) {
    const post = Post({
        'title': req.body.title,
        'content': req.body.content,
        'author': req.user.id
    });
    return await post.save()
}

postSchema.statics.getAll = async function() {
    return await this.find();
}

postSchema.statics.updatePost = async function(req) {
    //update the user account
    return await this.findOneAndUpdate({ _id: req.body.post_id }, {
        "title": req.body.title,
        "content": req.body.content
    }, { new: true });
};

postSchema.statics.deletePost = async function(req) {
    return await this.findByIdAndDelete(req.body.post_id)
}

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };