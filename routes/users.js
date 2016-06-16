const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const helpers = require('../helpers/routeHelpers');

router.get('/', (req, res)=>{
  res.redirect('/home');
});

router.get('/:id', (req, res)=>{
  knex('users').where('id', req.params.id).first().then(user=>{
    knex.select(['p.id', 'p.name as photo_name', 'p.url', 'p.date'])
    .from('photos as p').where('user_id', user.id)
    .then(data=>{
      const photos = helpers.assignFormattedDate(data);
      res.render('./components/users/show', {user, photos});
    });
  });
});

module.exports = router;