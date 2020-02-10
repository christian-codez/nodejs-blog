const mongoose = require('mongoose');
const helper = require("../helpers/encrypt")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'subscriber',
        lowercase: true,
        enum: ['admin', 'editor', 'subscriber']
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['male', 'female', 'rather not say']
    },
    country: {
        type: String,
        lowercase: true,
    },
    age: {
        type: String,
    },
    stacks: {
        type: Array,
    },
    bio: {
        type: String,
        minlength: 5,
        maxlength: 1000
    }
});

userSchema.statics.getAll = async function(email) {
    return await this.find().select("-_id -password -role -verified")
}

userSchema.statics.getId = async function(email) {
    return await this.findOne({ email: email }).select("_id")
}

userSchema.statics.findUser = async function(req) {
    return await this.findOne({ _id: req.params.id })
}

userSchema.statics.deleteUser = async function(req) {
    const id = await this.getId(req.user.email);
    return await this.findByIdAndDelete(id)
}

userSchema.statics.register = async function(req) {
    const user = User({
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "stacks": req.body.stacks,
        "gender": req.body.gender,
        "age": req.body.age,
        "country": req.body.country,
        "bio": req.body.bio,
    });

    return await user.save();
};

userSchema.statics.updateUser = async function(req) {
    //get the user Id
    const id = await this.getId(req.user.email);

    //update the user account
    return await this.findOneAndUpdate({ _id: id }, {
        "name": req.body.name,
        "stacks": req.body.stacks,
        "gender": req.body.gender,
        "age": req.body.age,
        "country": req.body.country,
        "bio": req.body.bio,
    }, { new: true });
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await helper.encrypt(this.password);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };