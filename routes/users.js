const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const helpers = require('../helpers/routeHelpers');

router.get('/', (req, res)=>{
  knex.select(['u.id', 'u.username', 'p.name as photo_name'])
  .from('users as u')
  .leftJoin('photos as p', 'u.id', 'p.user_id')
  .orderBy('u.id').then(data=>{
    // TODO: use the sql count or coalesce function along with the group by clause
    const users = helpers.assignPhotoCount(data);
    res.render('./components/users/index', {users, messages: req.flash('Login Success')});
  });
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

router.put('/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).update(req.body.user).then(()=>{
    res.redirect(`/users/${req.params.id}`);
  });
});

router.delete('/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).del().then(()=>{
    res.redirect(`/users`);
  });
});

router.get('/:id/edit', (req, res)=>{
  knex('users').where('id', +req.params.id).first().then(user=>{
    res.render('./components/users/edit', {user});
  });
});

module.exports = router;