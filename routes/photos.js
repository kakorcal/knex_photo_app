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

router.put('/:id', (req, res)=>{
  const photo = Object.assign(req.body.photo, {date: new Date()});
  knex('photos').where('id', +req.params.id).update(photo).then(()=>{
    res.redirect(`/users/${req.params.user_id}`);
  });
});

router.delete('/:id', (req, res)=>{
  knex('photos').where('id', +req.params.id).del().then(()=>{
    res.redirect(`/users/${req.params.user_id}`);
  });
});

router.get('/:id/edit', (req, res)=>{
  knex('photos').where('id', req.params.id).first().then(photo=>{
    res.render('./components/photos/edit', {photo});
  });
});

module.exports = router;