const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");



/* GET users listing. */
router.get('/', userController.index);
router.get('/:id', userController.single);
router.post('/', userController.create);
router.patch('/me', auth, userController.update);
router.delete('/me', auth, userController.delete);

module.exports = router;