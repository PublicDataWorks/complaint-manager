import { LOCAL_DEV_PORT, PORT } from "../../../sharedUtilities/constants";

export default {
  development: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: `http://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: `http://localhost:${LOCAL_DEV_PORT}`
  },
  static_development: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: `http://localhost:${PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: `http://localhost:${PORT}`
  },
  test: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: `http://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "test audience",
      responseType: "token id_token",
      scope: "openid profile read:cases",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: "http://localhost"
  },
  ci: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: "https://noipm-ci.herokuapp.com/callback",
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: "https://noipm-ci.herokuapp.com"
  },
  staging: {
    auth: {
      domain: "noipm-staging.auth0.com",
      clientID: "r4WGrntga7nkl4iDqnJiDVY6DAMqHFJ2",
      redirectUri: "https://noipm-staging.herokuapp.com/callback",
      audience: "https://noipm-staging.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    hostname: "https://noipm-staging.herokuapp.com"
  },
  production: {
    auth: {
      domain: "noipm-production.auth0.com",
      clientID: "i4ldwXNjx8O2JMhuHWwV4qERfClYN2bD",
      redirectUri: "https://noipm-production.herokuapp.com/callback",
      audience: "https://noipm-production.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-production.herokuapp.com/nickname"
    },
    hostname: "https://noipm-production.herokuapp.com"
  }
};
