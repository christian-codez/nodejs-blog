const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get('/', commentController.index);
router.post('/create', auth, commentController.create);
router.patch('/update', auth, commentController.update);
router.delete('/delete', auth, commentController.delete);

module.exports = router;