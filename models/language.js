var Sequelize = require('sequelize');

var sequelize = require('../config/db');

// var Film = require('./film');

var Language = sequelize.define('language', {
  id: {
    type: Sequelize.INTEGER,
    field: 'language_id',
    primaryKey: true
  },
  name: Sequelize.STRING,
  last_update: Sequelize.DATE
}, {
  timestamps: false,
  freezeTableName: true,
  // tableName: 'category'
});

// console.log(Film)


// Language.hasMany(Film, {
//   foreignKey: 'language_id'
// })

module.exports = Language;