var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          // give use a random bird photo if they don't have a photo
          if (user.google.picture === "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg") {
            user.google.picture = "/assets/images/birdpictures/bird" + Math.ceil(Math.random() * 10) + ".png";
          } else {
            user.google.profilePhoto = true;
          }
          user.google.accessToken = accessToken;
          user.google.refreshToken = refreshToken;
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          user.google = profile._json;
          // give use a random bird photo if they don't have a photo
          if (user.google.picture === "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg") {
            user.google.picture = "/assets/images/birdpictures/bird" + Math.ceil(Math.random() * 10) + ".png";
          } else {
            user.google.profilePhoto = true;
          }
          user.google.accessToken = accessToken;
          user.google.refreshToken = refreshToken;
          user.save(function() {
            return done(err, user);
          });
        }
      });
    }
  ));
};
