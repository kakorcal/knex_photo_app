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
      {name: 'Nigel', url: '/assets/dog1.jpg', date: new Date(), user_id: ids[0]},
      {name: 'Baxster', url: '/assets/dog2.jpg', date: new Date(), user_id: ids[0]},
      {name: 'Daisy', url: '/assets/dog3.jpg', date: new Date(), user_id: ids[1]},
      {name: 'Dog in the Park', url: '/assets/dog4.jpg', date: new Date(), user_id: ids[1]},
      {name: 'Dog with Ball', url: '/assets/dog5.jpg', date: new Date(), user_id: ids[2]},
      {name: 'Sitting Down', url: '/assets/dog7.jpg', date: new Date(), user_id: ids[1]},
      {name: 'Golden Retriever', url: '/assets/dog8.jpg', date: new Date(), user_id: ids[1]},
      {name: 'Doge', url: '/assets/dog9.jpg', date: new Date(), user_id: ids[0]},
      {name: 'Brownie', url: '/assets/dog10.jpg', date: new Date(), user_id: ids[2]},
      {name: 'Running in the Park', url: '/assets/dog11.jpg', date: new Date(), user_id: ids[2]}
    ]);
  });
};
