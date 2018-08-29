var path = require("path");
const LOCAL_DEV_PORT = require("../../sharedUtilities/constants")
  .LOCAL_DEV_PORT;

module.exports = {
  development: {
    host: "db",
    s3Bucket: "noipm-local",
    officerBucket: "nopd-officers-local",
    email: {
      secureConnection: false,
      host: "email",
      port: 587,
      fromEmailAddress: "dev_env_email@example.com"
    },
    authentication: {
      domain: "noipm-ci.auth0.com",
      publicKeyURL: "https://noipm-ci.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-ci.herokuapp.com/",
      issuer: "https://noipm-ci.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    contentSecurityPolicy: {
      connectSrc: [
        "'self'",
        "https://noipm-ci.auth0.com",
        `ws://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    winston: {
      logLevel: "info",
      json: true
    }
  },
  test: {
    host: process.env.CIRCLECI ? "localhost" : "db",
    port: 5432,
    email: {
      secureConnection: false,
      secure: false,
      ignoreTLS: true,
      host: "localhost",
      port: 2525,
      fromEmailAddress: "test_env_email@example.com"
    },
    authentication: {
      domain: "noipm-ci.auth0.com",
      publicKeyPath: path.join(__dirname, "..", "config", "test", "public.pem"),
      audience: "test audience",
      issuer: "test issuer",
      algorithm: "RS256",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    contentSecurityPolicy: {
      connectSrc: [
        "'self'",
        "https://noipm-ci.auth0.com",
        `ws://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    winston: {
      logLevel: "error",
      json: true
    }
  },
  ci: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-ci",
    officerBucket: "nopd-officers-ci",
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
      domain: "noipm-ci.auth0.com",
      publicKeyURL: "https://noipm-ci.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-ci.herokuapp.com/",
      issuer: "https://noipm-ci.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    contentSecurityPolicy: {
      connectSrc: ["'self'", "https://noipm-ci.auth0.com"]
    },
    winston: {
      logLevel: "info",
      json: false
    }
  },
  staging: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-staging",
    officerBucket: "nopd-officers-staging",
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
      domain: "noipm-staging.auth0.com",
      publicKeyURL: "https://noipm-staging.auth0.com/.well-known/jwks.json",
      audience: "https://noipm-staging.herokuapp.com/",
      issuer: "https://noipm-staging.auth0.com/",
      algorithm: "RS256",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    contentSecurityPolicy: {
      connectSrc: ["'self'", "https://noipm-staging.auth0.com"]
    },
    winston: {
      logLevel: "info",
      json: false
    }
  },
  production: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-production",
    officerBucket: "nopd-officers-production",
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
    contentSecurityPolicy: {
      connectSrc: ["'self'", "https://noipm-production.auth0.com"]
    },
    winston: {
      logLevel: "error",
      json: false
    }
  },
  s3config: {
    region: "us-east-2",
    sslEnabled: true,
    signatureVersion: "v4"
  }
};
