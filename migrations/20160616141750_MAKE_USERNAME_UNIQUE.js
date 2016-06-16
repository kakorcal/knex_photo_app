exports.up = function(knex, Promise) {
  return knex.schema.table('users', table=>{
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table=>{
    table.dropColumn('username');
    table.dropColumn('password');
  });  
};
