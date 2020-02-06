const { asyncMiddleware } = require('../middlewares/asyncMiddleware')

exports.index = asyncMiddleware(async(req, res) => {
    res.send("Hello from comments route");
});

exports.create = asyncMiddleware(async(req, res) => {
    res.send("create comments route");
});
exports.update = asyncMiddleware(async(req, res) => {
    res.send("update comments route");
});
exports.delete = asyncMiddleware(async(req, res) => {
    res.send("delete comments route");
});