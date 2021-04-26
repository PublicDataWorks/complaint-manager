import { LOCAL_DEV_PORT, PORT } from "../../../sharedUtilities/constants";

export default {
  development: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: `https://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: `https://localhost:${LOCAL_DEV_PORT}`,
    backendUrl: `https://localhost:${PORT}`
  },
  development_e2e: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: `https://app-e2e:${LOCAL_DEV_PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: `https://app-e2e:${LOCAL_DEV_PORT}`,
    backendUrl: `https://app-e2e:${LOCAL_DEV_PORT}`
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
    hostname: `http://localhost:${PORT}`,
    backendUrl: `https://localhost:${PORT}`
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
    hostname: "http://localhost",
    backendUrl: `https://localhost:${PORT}`
  },
  playground: {
    auth: {
      domain: "noipm-ci.auth0.com",
      clientID: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
      redirectUri: "https://noipm-playground.herokuapp.com/callback",
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: "https://rmwftjcbxh.execute-api.us-east-1.amazonaws.com",
    backendUrl: "https://noipm-playground.herokuapp.com"
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
    hostname: "https://hggkf95dtf.execute-api.us-east-1.amazonaws.com/",
    backendUrl: "https://noipm-ci.herokuapp.com"
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
    hostname: "https://49o089njl2.execute-api.us-east-1.amazonaws.com/",
    backendUrl: "https://noipm-staging.herokuapp.com"
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
    hostname: "https://eo9e748ns4.execute-api.us-east-1.amazonaws.com",
    backendUrl: "https://noipm-production.herokuapp.com"
  }
};
