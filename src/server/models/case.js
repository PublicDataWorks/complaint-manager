'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('case', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  });
};