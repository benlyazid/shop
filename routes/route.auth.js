const express = require('express');
const Passport = require('passport')

const authController = require('../controllers/controller.auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get("/auth42", authController.auth42);

module.exports = router;