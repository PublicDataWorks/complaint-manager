const path = require("path");
const LOCAL_DEV_PORT = require("../../sharedUtilities/constants")
  .LOCAL_DEV_PORT;

module.exports = {
  development: {
    host: "db",
    s3Bucket: "noipm-local",
    officerBucket: "nopd-officers-local",
    exportsBucket: "noipm-exports-local",
    referralLettersBucket: "noipm-referral-letters-local",
    complainantLettersBucket: "noipm-complainant-letters-local",
    authentication: {
      clientID: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
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
        `wss://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    corsOrigin: "*",
    winston: {
      logLevel: "info",
      json: true
    },
    queue: {
      host: "redis",
      port: 6379,
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  test: {
    host: process.env.CIRCLECI ? "localhost" : "db",
    s3Bucket: "noipm-local",
    port: 5432,
    exportsBucket: "noipm-exports-test",
    referralLettersBucket: "noipm-referral-letters-test",
    complainantLettersBucket: "noipm-complainant-letters-test",
    authentication: {
      clientID: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
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
        `wss://localhost:${LOCAL_DEV_PORT}`
      ]
    },
    corsOrigin: "*",
    winston: {
      logLevel: "error",
      json: true
    },
    queue: {
      host: "redis",
      port: 6379,
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  playground: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-playground",
    officerBucket: "nopd-officers-playground",
    exportsBucket: "noipm-exports-playground",
    referralLettersBucket: "noipm-referral-letters-playground",
    complainantLettersBucket: "noipm-complainant-letters-playground",
    authentication: {
      clientID: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
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
        "https://qofzbpm37l.execute-api.us-east-1.amazonaws.com"
      ]
    },
    corsOrigin: "https://noipm-playground.herokuapp.com",
    winston: {
      logLevel: "info",
      json: false
    },
    queue: {
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  ci: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-ci",
    officerBucket: "nopd-officers-ci",
    exportsBucket: "noipm-exports-ci",
    referralLettersBucket: "noipm-referral-letters-ci",
    complainantLettersBucket: "noipm-complainant-letters-ci",
    authentication: {
      clientID: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
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
    corsOrigin: "https://noipm-ci.herokuapp.com",
    winston: {
      logLevel: "info",
      json: false
    },
    queue: {
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  staging: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-staging",
    officerBucket: "nopd-officers-staging",
    exportsBucket: "noipm-exports-staging",
    referralLettersBucket: "noipm-referral-letters-staging",
    complainantLettersBucket: "noipm-complainant-letters-staging",
    authentication: {
      clientID: "ALqHj5NyIIfLzHJks7LI4LqarbDN8jhe",
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
    corsOrigin: "https://noipm-staging.herokuapp.com",
    winston: {
      logLevel: "info",
      json: false
    },
    queue: {
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  production: {
    port: 5432,
    host: process.env.DATABASE_HOST,
    s3Bucket: "noipm-production",
    officerBucket: "nopd-officers-production",
    exportsBucket: "noipm-exports-production",
    referralLettersBucket: "noipm-referral-letters-production",
    complainantLettersBucket: "noipm-complainant-letters-production",
    authentication: {
      clientID: "HdZblLPOunmyoPgF7X6GOs0ayTkssSbz",
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
    corsOrigin: "https://noipm-production.herokuapp.com",
    winston: {
      logLevel: "info",
      json: false
    },
    queue: {
      failedJobAttempts: 1,
      exponentialDelay: 60 * 1000,
      jobTimeToLive: 120 * 1000,
      jobUIPort: 5000
    }
  },
  s3config: {
    region: "us-east-1",
    sslEnabled: true,
    signatureVersion: "v4"
  }
};
