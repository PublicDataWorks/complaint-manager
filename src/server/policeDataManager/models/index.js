const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
let env = process.env.NODE_ENV || "development";
if (env === "test") {
  env += process.env.JEST_WORKER_ID;
}
const config = require(__dirname + "/../../config/sequelize_config.js")[env];
const commonDir = __dirname + "/../../common/models";
const db = {};
const dataChangeAuditHooks = require("../../sequelizeHooks/dataChangeAuditHooks");
const caseStatusHooks = require("../../sequelizeHooks/caseStatusHooks");

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

//TODO Refactor to pass in only the class references we need.
dataChangeAuditHooks.init(sequelize, Sequelize.Model);
caseStatusHooks.init(sequelize, Sequelize.Model);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

fs.readdirSync(commonDir)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = require(path.join(commonDir, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
