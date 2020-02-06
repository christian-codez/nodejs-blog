const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");



/* GET users listing. */
router.get('/', userController.index);
router.post('/create', userController.create);
router.patch('/update', auth, userController.update);
router.delete('/delete', auth, userController.delete);

module.exports = router;