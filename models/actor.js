var Sequelize = require('sequelize');

var sequelize = require('../config/db');

var Actor = sequelize.define('actor', {
  id: {
    type: Sequelize.INTEGER,
    field: 'actor_id',
    primaryKey: true
  },
  // actor_id: Sequelize.INTEGER,
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name'
  },
  last_update: Sequelize.DATE
}, {
  timestamps: false,
  freezeTableName: true,
  // tableName: 'actor'
});

module.exports = Actor;