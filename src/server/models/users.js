'use strict'
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING(25)
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING(25)
    },
    email: {
      field: 'email',
      type: DataTypes.STRING(100)
    },
    password: {
      field: 'password',
      type: DataTypes.STRING(50)
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE
    }
  })
}