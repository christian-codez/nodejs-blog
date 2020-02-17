const helper = require("../helpers/manage-tokens")

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization') ? req.header('Authorization').replace("Bearer ", "") : null;
        const decodedToken = await helper.verifyToken(token);
        if (typeof(decodedToken._id) === "undefined") return res.status(401).send('No/Invalid token provided!')
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = auth;