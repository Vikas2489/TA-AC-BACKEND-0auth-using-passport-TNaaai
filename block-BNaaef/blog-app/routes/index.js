var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// get request using github
router.get("/auth/github", passport.authenticate('github'));

// will get callback request on github
router.get("/auth/github/callback", passport.authenticate('github', { failureRedirect: "/users/login" }), (req, res) => {
    return res.redirect("/users/articles/new");
});

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: "/users/articles/new",
        failureRedirect: "/users/login"
    }));


router.get("/logout", (req, res) => {
    res.clearCookie('connect-sid');
    return res.render("/users/login");

});

module.exports = router;