const { asyncMiddleware } = require('../middlewares/asyncMiddleware');
const { User } = require("../models/user");
const { validateUserCreation, validateUserUpdate } = require("../validations/user-validation")
const { generateToken } = require("../helpers/manage-tokens");

exports.index = asyncMiddleware(async(req, res) => {
    const users = await User.getAll();
    res.send(users);
});

exports.create = asyncMiddleware(async(req, res) => {
    //validate user request
    const { error } = validateUserCreation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //register new user
    const user = await User.register(req);
    if (!user) return res.status(400).send("Oops! User could not be created.");
    //generate token
    const token = generateToken(req.body);
    //send response to the user
    res.header({ 'X-Auth-Token': token }).send(user);
});

exports.update = asyncMiddleware(async(req, res) => {
    //validate user request
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedUser = await User.updateUser(req);
    if (!updatedUser) return res.status(400).send("Oops! User could not be updated.");

    res.send(updatedUser);
});

exports.delete = asyncMiddleware(async(req, res) => {
    const user = await User.deleteUser(req)
    if (!user) return res.status(400).send("Oops! User could not be deleted.");

    res.send(user);
});