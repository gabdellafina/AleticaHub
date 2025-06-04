const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/verify-user', authController.verifyUser);
router.get('/verify-admin', authController.verifyAdmin);

module.exports = router;