//TO DO 
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
router.get('/profile',userController.getProfile);
router.patch('/update',userController.updateProfile);
module.exports = router;