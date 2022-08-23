var passport = require("passport");
var GithubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require("../models/User");

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        console.log(profile, "google profile");
        let profileData = {
                name: profile.displayName,
                email: profile.email,
                image: profile.picture
            }
            // User.findOrCreate({ googleId: profile.id }, function(err, user) {
            //     return done(err, user);
            // });
        User.findOne({ email: profile.email }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                User.create(profileData, (err, addedUser) => {
                    if (err) return done(err);
                    return done(null, addedUser);
                });
            }
            if (user) {
                return done(null, user);
            }
        });
    }
));

passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    let profileData = {
        name: profile.displayName,
        email: profile._json.email,
        image: profile._json.avatar_url
    };
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
            User.create(profileData, (err, addedUser) => {
                if (err) return done(err);
                return done(null, addedUser);
            });
        }
        if (user) {
            return done(null, user);
        }
    });
}));

passport.serializeUser((addedUser, done) => {
    return done(null, addedUser.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
})