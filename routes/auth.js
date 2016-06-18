const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const authHelpers = require('../helpers/authHelpers');
const _ = require('lodash');
// TODO: Separate passport/bcrypt logic into separate file

//***************************************************************************
  // LOCAL
//***************************************************************************
// This passport middleware searches req.body and grabs the username and plain-text password
passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback: true
},
// This callback includes the username and password that has been specified in the object above.
  function verifyLocal(req, username, password, done){
    console.log('Verify');
    knex('users').where({username}).first().then(user=>{
      if(!user) return done(null, false, {message: 'Username Does Not Exist'});
      
      bcrypt.compare(password, user.password, (err, res)=>{
        if(err) return done(err);
        if(!res) {
          return done(null, false, {message: 'Incorrect Password'});
        }else{
          return done(null, user, {message: 'Login Successful'});
        }
      });
    });
  }
));

//***************************************************************************
  // OAUTH FACEBOOK
//***************************************************************************
passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.LOCAL_HOST}${process.env.CALLBACK_URL}`,
  profileFields: ['id', 'displayName', 'email']
}, 
// facebook will send back the token and profile
function verifyFacebook(accessToken, refreshToken, profile, done){
  // find the user in the database based on their facebook username
  const {id, name, email} = profile._json;
  knex('users').where('username', name).first().then(user=>{
    if(user){
      // TODO: Should verify if the user has already signed up locally 
      return done(null, user, {message: 'Login Successful With Facebook'});
    }else{
      // Create New User
      // TODO: Currently the password column for the users table in not nullable. 
      // should alter the password constraint instead of adding dummy passwords
      knex('users').insert({username: name, password: 'foo'}).returning('*').then(([user])=>{
        return done(null, user, {message: 'Login Successful With Facebook'});
      });
    }
  }).catch(err=>{
    return done(err);
  }); 
}));

passport.serializeUser(function(user, done){
  console.log('SERIALIZE');
  // set req.session.id = user.id
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('DESERIALIZE');
  knex('users').where("id",id).first().then(user => {
    done(null, user);
  }).catch(err => {
    done(err);
  });
});

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

// TODO: Add middleware to customize the verify callback. Mainly for error handling and 
// adding different types of flash messages 
router.get('/facebook/callback', passport.authenticate('facebook', { 
  successRedirect: '/users', 
  failureRedirect: '/home'
}));

router.get('/new', (req, res)=>{
  res.render('./components/auth/signup', {messages: req.flash('Sign Up Error')});
});

router.post('/new', authHelpers.preventLoginSignup, (req, res, next)=>{
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
    bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
      // Store hash in db
      const credentials = _.assign(_.omit(req.body.user, 'password'), {password: hash});
      knex('users').insert(credentials).then(()=>{
        // When passport.authenticate is called it invokes the local strategy constructor
        // the verify callback is invoked with different params depending on the control flow of the
        // local strategy constructor
        passport.authenticate('local', (err, user, flash)=>{
          console.log('Authenticate after creating account');
          // This line is from the example in the docs, so unsure of what middleware is 
          // invoked next if err exists
          if(err) return next(err);
          // This if statement is technically not necessary when the user creates an account
          // because we know for sure that the password is going to be correct.
          if(!user) {
            req.flash('Login Error', flash.message);
            return res.redirect('/auth/new');
          }
          // if user has successfully created an account or verified their credentials
          // call the logIn method. 
          // When logIn is invoked, user is passed to serializeUser (if creating an account or 
          // if they have an account and they are trying to login) and deserializeUser (this method 
          // is called everytime to check if the stamp, aka session still exists)
          req.logIn(user, err=>{
            // This callback is invoked only after serializing and deserializing
            if(err) return next(err);
            req.flash('Login Success', flash.message);
            return res.redirect(`/users/${user.id}`);
          });
        })(req, res, next);
      }).catch(err=>{
        // TODO: Add flash message if username is taken. Redirect to signup page
        req.flash('Sign Up Error', 'Username Is Taken');
        res.redirect('/auth/new');
      });
    });
  });
});

router.get('/login', (req, res)=>{
  res.render('./components/auth/login');
});

router.post('/login', authHelpers.preventLoginSignup, (req, res, next)=>{
  passport.authenticate('local', (err, user, flash)=>{
    console.log('Authenticate after logging in');
    if(err) return next(err);
    if(!user) {
      req.flash('Login Error', flash.message);
      return res.redirect('/auth/new');
    }
    
    req.logIn(user, err=>{
      if(err) return next(err);
      req.flash('Login Success', flash.message);
      return res.redirect(`/users/${user.id}`);
    });
  })(req, res, next);  
});

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('Logout Success', 'You Have Logged Out');
  res.redirect('/home');
});

module.exports = router;