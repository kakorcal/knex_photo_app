exports.seed = function(knex, Promise) {
  return knex('users').del().then(()=>{
    return knex('users').insert([
      {username: 'Steve'},   
      {username: 'Andrew'},   
      {username: 'Uthra'},   
      {username: 'Parker'},   
    ]).returning('id');
  }).then(ids=>{
    return knex('photos').insert([
      {name: 'blah1blah1blah1', url: 'dog1.jpg', date: new Date(), user_id: ids[0]},
      {name: 'blah2blah1', url: 'dog2.jpg', date: new Date(), user_id: ids[0]},
      {name: 'blah3blah1', url: 'dog3.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah4blah1', url: 'dog4.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah5', url: 'dog5.jpg', date: new Date(), user_id: ids[2]},
      {name: 'blah7', url: 'dog7.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah8', url: 'dog8.jpg', date: new Date(), user_id: ids[1]},
      {name: 'blah9blah1', url: 'dog9.jpg', date: new Date(), user_id: ids[0]},
      {name: 'blah10blah1blah1', url: 'dog10.jpg', date: new Date(), user_id: ids[2]},
      {name: 'blah11', url: 'dog11.jpg', date: new Date(), user_id: ids[2]}
    ]);
  });
};
