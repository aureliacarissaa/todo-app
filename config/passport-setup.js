const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "912181329147-2g14unl5fv37ejb5nuejp4qne84f43p1.apps.googleusercontent.com",
    clientSecret: "zKHulE_4OAyUXK8fO10ZLc6F",
    callbackURL: "/oauth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));