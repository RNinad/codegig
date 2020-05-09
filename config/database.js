const { Sequelize } = require('sequelize');
module.exports = new Sequelize('codegig', 'postgres', 'qbintern', {
    host: 'localhost',
    dialect: 'postgres'
  });
