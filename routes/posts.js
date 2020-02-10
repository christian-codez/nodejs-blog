const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get('/', postController.index);
router.get('/search', postController.search);
router.post('/', auth, postController.create);
router.patch('/:id', auth, postController.update);
router.delete('/:id', auth, postController.delete);

module.exports = router;