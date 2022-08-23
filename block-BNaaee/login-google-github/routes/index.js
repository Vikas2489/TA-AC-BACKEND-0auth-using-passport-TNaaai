var express = require('express');
var router = express.Router();
var passport = require("passport");
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// success page 
router.get("/success", (req, res, next) => {
    return res.render("success");
});

// failure page 
router.get("/failure", (req, res, next) => {
    return res.send("failure");
});

// github login request
router.get("/auth/github", passport.authenticate('github'));

// google login request
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

// route on which google will get back 
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    }));


// route on which github will get back 
router.get("/auth/github/callback", passport.authenticate('github', { failureRedirect: "/failure" }), (req, res) => {
    return res.redirect("/success");
});


// register form 
router.get("/register", (req, res, next) => {
    return res.render("registerForm");
});

// post register form
router.post("/", (req, res, next) => {
    User.create(req.body, (err, user) => {
        if (err) return next(err);
        return res.redirect('/');
    });
});

// login
router.post('/login', (req, res, next) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.send('email/password required');
    }
    User.findOne({ email }, (err, user) => {
        if (err) return next(err);
        user.verifyPassword(password, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.redirect("/success");
            }
            if (!result) {
                res.redirect("/failure");
            }
        })
    });
});

// logout
router.get("/logout", (req, res, next) => {
    res.clearCookie('connect-sid');
    return res.redirect("/");
})

module.exports = router;