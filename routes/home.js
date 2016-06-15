const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', (req, res)=>{
  res.render('home');
});

module.exports = router;