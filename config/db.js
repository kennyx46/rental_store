var Sequelize = require('sequelize');
var sequelize = new Sequelize('sakila', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;

// we need models for:
// film title
// film description
// film category
// film actor name
// film language name
// api/search?category='f1f1f1'
// api/search?actor='f2f2f2'
// api/categories
// api/languages
// api/actors



// film language
// film category
// film actor



// sequelize.sync().then(function() {
//   return Actor.findOne();
// }).then(function (actor) {
//   // console.log(actor.first_name)
// });

// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//   });