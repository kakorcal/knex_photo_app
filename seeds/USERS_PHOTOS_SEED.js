exports.seed = function(knex, Promise) {
  return knex('users').del().then(()=>{
    return knex('users').insert([
      {username: 'steve'},   
      {username: 'andrew'},   
      {username: 'uthra'},   
      {username: 'parker'},   
    ]).returning('id');
  }).then(ids=>{
    return knex('photos').insert([
      {name: 'blah1', url: 'dog1.jpg', date: new Date(), user_id: ids[0]},
      {name: 'blah2', url: 'dog2.jpg', date: new Date(), user_id: ids[0]},
      {name: 'blah3', url: 'dog3.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah4', url: 'dog4.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah5', url: 'dog5.jpg', date: new Date(), user_id: ids[2]},
    ]);
  });
};
