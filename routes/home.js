const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const _ = require('lodash');

router.get('/', (req, res)=>{
  knex.select([
    'u.id', 'u.username', 'p.id as photo_id', 'p.name as photo_name', 'p.url', 'p.date'
  ]).from('users as u')
  .join('photos as p', 'u.id', 'p.user_id')
  .orderBy('p.id').then(data=>{
    const users = _.map(data, (cur)=>{
      const mmddyear = new Date().toString().match(/[a-zA-Z]{3} \d{2} \d{4}/)[0];
      return _.assignIn(cur, {date: mmddyear});
    });
    res.render('home', {users});
  });
});

module.exports = router;