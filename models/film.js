var Sequelize = require('sequelize');

var sequelize = require('../config/db');

var Language = require('./language');
var Category = require('./category');
var Actor = require('./actor');

var Film = sequelize.define('film', {
  id: {
    type: Sequelize.INTEGER,
    field: 'film_id',
    primaryKey: true
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  release_year: Sequelize.STRING,
  language_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Language',
      key: 'language_id'
    }
  },
  original_language_id: Sequelize.INTEGER,
  rental_duration: Sequelize.INTEGER,
  rental_rate: Sequelize.INTEGER,
  length: Sequelize.INTEGER,
  replacement_cost: Sequelize.INTEGER,
  rating: Sequelize.INTEGER,
  special_features: Sequelize.STRING,
  last_update: Sequelize.DATE
}, {
  timestamps: false,
  freezeTableName: true,
  // tableName: 'category'
});

// Film.belongsTo(Language, {
//   foreignKey: 'language_id'
// })


// Film.belongsToMany(Category, {
//   through: 'film_category',
//   // as: 'pendingTags',
//   // foreignKey: 'film_id',
//   // constraints: false
// });

Film.belongsToMany(Category, {
  through: 'film_category',
  timestamps: false,
  foreignKey: 'film_id',
  otherKey: 'category_id'
  // as: 'pendingTags',
  // foreignKey: 'film_id',
  // constraints: false
});

Film.belongsToMany(Actor, {
  through: 'film_actor',
  timestamps: false,
  foreignKey: 'film_id',
  otherKey: 'actor_id'
  // as: 'pendingTags',
  // foreignKey: 'film_id',
  // constraints: false
});

Film.belongsTo(Language, {
  foreignKey: 'language_id'
})


module.exports = Film;