const { asyncMiddleware } = require('../middlewares/asyncMiddleware')

exports.index = asyncMiddleware(async(req, res) => {
    res.send("Hello from post route");
});
exports.search = asyncMiddleware(async(req, res) => {
    res.send("search  post route");
});
exports.create = asyncMiddleware(async(req, res) => {
    res.send("create post route");
});
exports.update = asyncMiddleware(async(req, res) => {
    res.send("update post route");
});
exports.delete = asyncMiddleware(async(req, res) => {
    res.send("delete user route");
});