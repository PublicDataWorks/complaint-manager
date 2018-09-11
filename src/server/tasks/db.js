var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require("./task_config")[env];
var db = {};

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
