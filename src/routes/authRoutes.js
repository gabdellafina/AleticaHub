import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-user', authController.verifyUser);
router.get('/verify-admin', authController.verifyAdmin);

export default router;