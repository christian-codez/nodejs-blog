const helper = require("../helpers/manage-tokens")
const { asyncMiddleware } = require("./asyncMiddleware");
const { User } = require("../models/user")




async function auth(req, res, next) {
    try {
        const decodedToken = helper.verifyToken(req.header('X-Auth-Token'))
        if (!decodedToken) return res.status(401).send('Access Denied. No token/Invalid token provided!')
        req.user = decoded;
        const idObj = await User.getId(req.user.email);
        req.user.id = idObj.id;

        next();
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = auth;