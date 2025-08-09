const authController = require('../controller/authController');
const express = require('express');

const authRouter = express.Router();

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogIn);
authRouter.post('/logout', authController.postLogout);
authRouter.get('/signup', authController.getSignup);
authRouter.post('/signup', authController.postSignup);

module.exports = authRouter;