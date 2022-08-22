var passport = require("passport");
var GithubStrategy = require("passport-github").Strategy;
var User = require("../models/User");


passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    let profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
        image: profile._json.avatar_url
    };

    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (user) {
            return done(null, user);
        }
        if (!user) {
            User.create(profileData, (err, addedUser) => {
                if (err) return done(err);
                return done(err, addedUser);
            });
        }
    });
}));

passport.serializeUser((addedUser, done) => {
    console.log(addedUser);
    done(null, addedUser._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});