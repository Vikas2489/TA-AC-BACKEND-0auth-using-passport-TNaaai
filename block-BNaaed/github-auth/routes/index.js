var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


// SUCCESS 
router.get("/success", (req, res, next) => {
    res.render("success");
});

//failure
router.get("/failure", (req, res, next) => {
    res.send("failure");
})

// github
router.get("/auth/github", passport.authenticate('github'));

// callback route of github
router.get("/auth/github/callback", passport.authenticate('github', { failureRedirect: "/failure" }), (req, res) => {
    return res.redirect("/success");
})

router.get("/logout", (req, res, next) => {
    res.clearCookie("connect-sid");
    return res.redirect("/");
})

module.exports = router;