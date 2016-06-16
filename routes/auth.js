const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/new', (req, res)=>{
  res.render('./components/auth/signup');
});

router.get('/login', (req, res)=>{
  res.render('./components/auth/login');
});

module.exports = router;