import { LOCAL_DEV_PORT, PORT } from "../../sharedUtilities/constants";

export default {
  development: {
    auth: {
      domain: "noipm-dev.auth0.com",
      clientID: "LwpX2IDfqQRJs3PI7Ckm8AK6m1TLXv99",
      redirectUri: `http://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: ""
  },
  static_development: {
    auth: {
      domain: "noipm-dev.auth0.com",
      clientID: "LwpX2IDfqQRJs3PI7Ckm8AK6m1TLXv99",
      redirectUri: `http://localhost:${PORT}/callback`,
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: ""
  },
  test: {
    auth: {
      domain: "noipm-dev.auth0.com",
      clientID: "LwpX2IDfqQRJs3PI7Ckm8AK6m1TLXv99",
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
      domain: "noipm-dev.auth0.com",
      clientID: "LwpX2IDfqQRJs3PI7Ckm8AK6m1TLXv99",
      redirectUri: "https://noipm-ci.herokuapp.com/callback",
      audience: "https://noipm-ci.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
    },
    hostname: ""
  },
  staging: {
    auth: {
      domain: "noipm.auth0.com",
      clientID: "2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI",
      redirectUri: "https://noipm-staging.herokuapp.com/callback",
      audience: "https://noipm-staging.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname"
    },
    hostname: ""
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
    hostname: ""
  }
};
