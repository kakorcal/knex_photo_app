exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', table=>{
    table.increments();
    table.string('name');
    table.string('url');
    table.integer('user_id').unsigned().index().references('users.id').onDelete('CASCADE');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
