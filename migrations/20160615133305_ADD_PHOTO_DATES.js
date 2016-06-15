exports.up = function(knex, Promise) {
  return knex.schema.table('photos', table=>{
    table.date('date');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('photos', table=>{
    table.dropColumn('date');
  });  
};
