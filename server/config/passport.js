const passport = require('passport')
var config = require('../config')
var User = require('../models/user')
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new FacebookStrategy(config.facebookAuth,
  function(accessToken, refreshToken, profile, done) {

  	var data = profile._json
  	User.findOne({
            'email': data.email 
        }, function(err, user) {
        	console.log(user)
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User();
                user.name = data.first_name + ' ' +data.last_name
                user.email = data.email
                user.phone = 'no phone from social login'
                user.provider = 'facebook'

                user.save(function(err) {
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
  }
))

passport.use(new GoogleStrategy(config.googleAuth,
  function(accessToken, refreshToken, profile, done) {
  	User.findOne({
            'email': profile.emails[0].value
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User();
                user.name = profile.displayName
                user.email = profile.emails[0].value
                user.phone = 'no phone from social login'
                user.provider = 'google'

                user.save(function(err) {
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
  }
))

module.exports =  passport