'use strict';

const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json');
let dbConfig = {};

switch (env) {
  case 'production':
    dbConfig = config['production']
    break;
  default:
    dbConfig = config['development']
    break;
}
console.log(dbConfig);

module.exports = new Sequelize(dbConfig['database'], dbConfig['username'], '', dbConfig)
