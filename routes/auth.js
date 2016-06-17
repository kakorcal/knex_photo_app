const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const _ = require('lodash');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback: true
},
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
      if(!user){
        return done(null, false, {message: 'Incorrect Username.'});
      }

      bcrypt.compare(password, user.password, (err, res)=>{
        console.log('inside compare function');
        console.log('err', err);
        console.log('res', res);
        eval(require('locus'));
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
  console.log('user', user);
  console.log('done', done);
  eval(require('locus'));
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('DESERIALIZE');
  console.log('id', id);
  console.log('done', done);
  eval(require('locus'));
  knex('users').where("id",id).first().then(user => {
    eval(require('locus'));
    done(null, user);
  }).catch(err => {
    eval(require('locus'));
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
      knex('users').insert(credentials, '*').then(([user])=>{
        eval(require('locus'));
        passport.authenticate('local', (err, user, info)=>{
          console.log('Authenticate after creating account');
          console.log('Error', err);
          console.log('User', user);
          console.log('Info', info);
          eval(require('locus'));
          if(err) return next(err);
          if(!user) return res.redirect('/auth/new');
          req.logIn(user, err=>{
            if(err) return next(err);
            return res.redirect('/users');
          });
        })(req, res, next);
      }).catch(err=>{
        eval(require('locus'));
        res.redirect('/fail');
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