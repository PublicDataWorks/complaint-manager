require("@babel/register");

module.exports = {
  development: {
    host: "db",
    username: "postgres",
    password: "password",
    database: "complaint-manager",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  test1: {
    host: process.env.CIRCLECI ? "localhost" : "db",
    username: "postgres",
    password: "password",
    database: "complaint-manager-test1",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: false,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  test2: {
    host: process.env.CIRCLECI ? "localhost" : "db",
    username: "postgres",
    password: "password",
    database: "complaint-manager-test2",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: false,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  playground: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: true
    },
    dialect: "postgres",
    operatorsAliases: false,
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  ci: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: true
    },
    dialect: "postgres",
    operatorsAliases: false,
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  staging: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: true
    },
    dialect: "postgres",
    operatorsAliases: false,
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  production: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: true
    },
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: false,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  }
};
