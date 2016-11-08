var Sequelize = require('sequelize');

var sequelize = require('../config/db');

// var Film = require('./film');

var Category = sequelize.define('category', {
  id: {
    type: Sequelize.INTEGER,
    field: 'category_id',
    primaryKey: true
  },
  name: Sequelize.STRING,
  last_update: Sequelize.DATE
}, {
  timestamps: false,
  freezeTableName: true,
  // tableName: 'category'
});

// Category.belongsToMany(Film, {
//   through: 'film_category',
//   timestamps: false,
//   foreignKey: 'film_id',
//   otherKey: 'category_id'
//   // as: 'pendingTags',
//   // foreignKey: 'film_id',
//   // constraints: false
// });

module.exports = Category;