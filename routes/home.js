const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const routeHelpers = require('../helpers/routeHelpers');
const _ = require('lodash');

router.get('/', (req, res)=>{
  knex.select([
    'u.id', 'u.username', 'p.id as photo_id', 'p.name as photo_name', 'p.url', 'p.date'
  ]).from('users as u')
  .join('photos as p', 'u.id', 'p.user_id')
  .orderBy('p.id').then(data=>{
    const flash = _.reduce(['Logout Success', 'Prevent Login Signup'], (acc, cur)=>{
      return acc.concat(req.flash(cur));
    }, []);
    res.render('home', {users: routeHelpers.assignFormattedDate(data), messages: flash});
  });
});

module.exports = router;