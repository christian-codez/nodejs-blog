const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get('/', postController.index);
router.post('/search', postController.search);
router.post('/', auth, postController.create);
router.patch('/', auth, postController.update);
router.delete('/', auth, postController.delete);

module.exports = router;