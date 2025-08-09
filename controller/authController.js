const { check, validationResult } = require('express-validator');
const User = require('../model/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {pageTitle: 'login', currentPage: 'login', isLoggedIn: false, errors: [], oldInput: { email: ''}, user: {}});
};

exports.postLogIn = async (req, res, next) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(422).render('auth/login', {
            pageTitle: 'login',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ['user does not exist'],
            oldInput: {email}, 
            user: {}
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(422).render('auth/login', {
            pageTitle: 'login',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ["Invalid Password"],
            oldInput: {email},
            user: {}
        })
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect('/')
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {pageTitle: 'Signup', currentPage: 'signup', isLoggedIn: false, errors: [], oldInput: {firstName: '', lastName: '', email: '', userType: ''}, user: {}})
};

exports.postSignup = [
    //First Name Validatoion
    check('firstName')
    .trim()
    .isLength({min: 2})
    .withMessage("First Name must be atleast 2 character long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name must contain only alphabets"),

    //Last Name Validation
    check('lastName')
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name must contain only alphabets"),

    //Email Validation
    check('email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

    //Password Validator
    check('password')
    .isLength({min: 8})
    .withMessage("Password should be atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain only one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain atleast one symbol"),

    //Confirm Password Validation
    check('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Password do no match")
        }
        return true;
    }),

    //User Type Validation
    check('userType')
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(['guest', 'host'])
    .withMessage("Invalid user type"),

    //Terms and Condition
    check('terms')
    .notEmpty()
    .withMessage("Please accept the terms and condition")
    .custom((value, {req}) => {
        if (value !== 'on') {
            throw new Error("Please accept the terms and condition")
        }
        return true
    }),

    (req, res, next) => {
        const {firstName, lastName, email, password, userType} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'Signup',
                currentPage: 'signup',
                isLoggedIn: false,
                errors: errors.array().map(err => err.msg),
                oldInput: {firstName, lastName, email, password, userType}
            })
        }

        bcrypt.hash(password, 12)
        .then(hashPassword => {
            const user = new User({firstName, lastName, email, password: hashPassword, userType})
            return user.save();
        })
        .then(() => {
            res.redirect('/login')
        })
        .catch(err => {
            return res.status(422).render('auth/signup', {
                pageTitle: 'Signup',
                currentPage: 'signup',
                isLoggedIn: false,
                errors: [err.message],
                oldInput: {firstName, lastName, email, password, userType}
            })
        })
    }
];