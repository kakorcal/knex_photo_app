const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', (req, res)=>{
  knex.select(['u.id', 'u.username', 'p.id as photo_id', 'p.name as photo_name', 'p.url'])
  .from('users as u')
  .join('photos as p', 'u.id', 'p.user_id')
  .orderBy('u.id').then(users=>{
    res.render('home', {users});
  });
});

module.exports = router;