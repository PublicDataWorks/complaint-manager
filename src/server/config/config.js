module.exports = {
  development: {
    username: "postgres",
    password: "password",
    database: "complaint-manager",
    host: "db",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data"
  },
  staging: {
    username: process.env.DATABASE_USERNAME,
    password:  process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions:{
      ssl:true
    },
    port: 5432,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data"
  }
}
