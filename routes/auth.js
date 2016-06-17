const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const _ = require('lodash');

// This passport middleware searches req.body and grabs the username and plain-text password
passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback: true
},
// This callback includes the username and password that has been specified in the object above.
  function onSubmit(req, username, password, done){
    console.log('LocalStrategy');
    console.log('username', username);
    console.log('password', password);
    console.log('done', done);
    eval(require('locus'));
    knex('users').where({username}).first().then(user=>{
      console.log('inside last tests');
      console.log('user', user);
      eval(require('locus'));
      if(!user) return done(null, false, {message: 'Incorrect Username.'});
      
      bcrypt.compare(password, user.password, (err, res)=>{
        console.log('inside compare function');
        console.log('err', err);
        console.log('res', res);
        eval(require('locus'));
        // Test if this error should be passed to the verify callback or just throw an error
        if(err) throw err;
        if(!res) {
          return done(null, false, {message: 'Incorrect Password.'});
        }else{
          return done(null, user, {message: 'You are now logged in.'});
        }
      });
    });
  }
));

passport.serializeUser(function(user, done){
  console.log('SERIALIZE');
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('DESERIALIZE');
  eval(require('locus'));
  knex('users').where("id",id).first().then(user => {
    eval(require('locus'));
    done(null, user);
  }).catch(err => {
    done(err);
  });
});

router.get('/new', (req, res)=>{
  res.render('./components/auth/signup');
});


router.post('/new', (req, res, next)=>{
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
    bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
      // Store hash in db
      const credentials = _.assign(_.omit(req.body.user, 'password'), {password: hash});
      knex('users').insert(credentials).then(()=>{
        eval(require('locus'));
        // When passport.authenticate is called it invokes the local strategy constructor
        // the verify callback is invoked with different params depending on the control flow of the
        // local strategy constructor
        passport.authenticate('local', (err, user, info)=>{
          console.log('Authenticate after creating account');
          console.log('Error', err);
          console.log('User', user);
          console.log('Info', info);
          eval(require('locus'));
          // This line is from the example in the docs, so unsure of what middleware is 
          // invoked next if err exists
          if(err) return next(err);
          // TODO: Add flash message
          if(!user) return res.redirect('/auth/new');
          // if user has successfully created an account or verified their credentials
          // call the logIn method. Not sure why it is attached to the req object and 
          // not attached as a passport method. 
          // When logIn is invoked, user is passed to serializeUser (if creating an account or 
          // if they have an account and they are trying to login) and deserializeUser (this method 
          // is called everytime to check if the stamp, aka session still exists)
          req.logIn(user, err=>{
            // This error first callback is invoked only after serializing and deserializing
            if(err) return next(err);
            return res.redirect('/users');
          });
        })(req, res, next);
      }).catch(err=>{
        res.redirect('/error');
      });
    });
  });
});

router.get('/login', (req, res)=>{
  res.render('./components/auth/login');
});

// router.post('/login', 
//   passport.authenticate('local', {
//     successRedirect: '/users',
//     failureRedirect: '/auth/new'
//   })
// );

module.exports = router;