var path = require("path");
const LOCAL_DEV_PORT = require("../../sharedUtilities/constants")
  .LOCAL_DEV_PORT;

module.exports = {
  development: {
    host: "db",
    s3Bucket: "noipm-staging",
    email: {
      secureConnection: false,
      host: "email",
      port: 587,
      fromEmailAddress: "dev_env_email@example.com"
    },
    sequelizeConfig: {
      username: "postgres",
      password: "password",
      database: "complaint-manager",
      dialect: "postgres",
      migrationStorageTableName: "sequelize_meta",
      seederStorage: "sequelize",
      seederStorageTableName: "sequelize_data"
    },
    authentication: {
      domain: "noipm.auth0.com",
      publicKeyURL: "https://noipm.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-staging.herokuapp.com/",
      issuer: "https://noipm.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    operatorsAliases: false,
    contentSecurityPolicy: {
      connectSrc: [
        "'self'",
        "https://noipm.auth0.com",
        `ws://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    winstonLogLevel: "info"
  },
  test: {
    host: process.env.CIRCLECI ? "localhost" : "db",
    port: 5432,
    s3Bucket: "noipm-staging",
    sequelizeConfig: {
      username: "postgres",
      password: "password",
      database: "complaint-manager-test",
      dialect: "postgres",
      migrationStorageTableName: "sequelize_meta",
      seederStorage: "sequelize",
      seederStorageTableName: "sequelize_data",
      logging: false
    },
    email: {
      secureConnection: false,
      secure: false,
      ignoreTLS: true,
      host: "localhost",
      port: 2525,
      fromEmailAddress: "test_env_email@example.com"
    },
    authentication: {
      domain: "noipm.auth0.com",
      publicKeyPath: path.join(__dirname, "..", "config", "test", "public.pem"),
      audience: "test audience",
      issuer: "test issuer",
      algorithm: "RS256",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    operatorsAliases: false,
    contentSecurityPolicy: {
      connectSrc: [
        "'self'",
        "https://noipm.auth0.com",
        `ws://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    winstonLogLevel: "error"
  },
  staging: {
    sequelizeConfig: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      dialectOptions: {
        ssl: true
      },
      dialect: "postgres",
      migrationStorageTableName: "sequelize_meta",
      seederStorage: "sequelize",
      seederStorageTableName: "sequelize_data"
    },
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-staging",
    email: {
      host: "smtp-mail.outlook.com",
      port: 587,
      secureConnection: false,
      //Apparently, TLS requires this to be false.
      //https://stackoverflow.com/questions/19509357/not-able-to-connect-to-outlook-com-smtp-using-nodemailer
      tls: {
        ciphers: "SSLv3"
      },
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      },
      fromEmailAddress: process.env.EMAIL_ADDRESS
    },
    authentication: {
      domain: "noipm.auth0.com",
      publicKeyURL: "https://noipm.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-staging.herokuapp.com/",
      issuer: "https://noipm.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    operatorsAliases: false,
    contentSecurityPolicy: {
      connectSrc: ["'self'", "https://noipm.auth0.com"]
    },
    winstonLogLevel: "info"
  },
  production: {
    sequelizeConfig: {
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
      logging: false
    },
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-production",
    email: {
      host: "smtp-mail.outlook.com",
      port: 587,
      //Apparently, TLS requires this to be false.
      //https://stackoverflow.com/questions/19509357/not-able-to-connect-to-outlook-com-smtp-using-nodemailer
      secureConnection: false,
      tls: {
        ciphers: "SSLv3"
      },
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      },
      fromEmailAddress: process.env.EMAIL_ADDRESS
    },
    authentication: {
      domain: "noipm-production.auth0.com",
      publicKeyURL: "https://noipm-production.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-production.herokuapp.com/",
      issuer: "https://noipm-production.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-production.herokuapp.com/nickname"
    },
    operatorsAliases: false,
    contentSecurityPolicy: {
      connectSrc: ["'self'", "https://noipm-production.auth0.com"]
    },
    winstonLogLevel: "error"
  }
};
