const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/auth");

/* GET comment listing. */
router.get('/:post_id', commentController.index);
router.post('/:post_id', auth, commentController.create);
router.patch('/:post_id/:comment_id', auth, commentController.update);
router.delete('/:post_id/:comment_id', auth, commentController.delete);

module.exports = router;