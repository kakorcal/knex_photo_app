const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const helpers = require('../helpers/routeHelpers');

router.get('/', (req, res)=>{
  knex.select([
    'u.id', 'u.username', 'p.id as photo_id', 'p.name as photo_name', 'p.url', 'p.date'
  ]).from('users as u')
  .join('photos as p', 'u.id', 'p.user_id')
  .orderBy('p.id').then(data=>{
    res.render('home', {users: helpers.assignFormattedDate(data)});
  });
});

module.exports = router;