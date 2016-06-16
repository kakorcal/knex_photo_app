const express = require('express');
const router = express.Router({mergeParams: true});
const knex = require('../db/knex');
const helpers = require('../helpers/routeHelpers.js');

router.get('/', (req, res)=>{
  res.redirect(`/users/${req.params.user_id}`);
});

router.post('/', (req, res)=>{
  const photo = Object.assign(req.body.photo, {user_id: +req.params.user_id, date: new Date()});
  knex('photos').insert(photo).then(()=>{
    res.redirect(`/users/${req.params.user_id}`);
  });
});

router.get('/new', (req, res)=>{
  res.render('./components/photos/new', {user_id: req.params.user_id});
});

module.exports = router;