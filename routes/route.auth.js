const express = require('express');
const Passport = require('passport')
const { check, body } = require('express-validator')

const authController = require('../controllers/controller.auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email', "invalide Email").isEmail(),
    check("password", "please enter a valide password with lenth > 5 ").notEmpty()
    .isLength({min : 6}),
    body('confirmPassword').custom((value, {req}) => {
        if (value != req.body.password)
            throw "Password should be the same"
        return true
    })
    
], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get("/auth42", authController.auth42);

module.exports = router;

obj = {
    name : "max",
    func() {
        console.log(this.name)
    }
}