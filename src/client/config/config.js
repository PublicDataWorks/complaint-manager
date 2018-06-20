import { LOCAL_DEV_PORT, PORT } from "../../sharedUtilities/constants";

export default {
  development: {
    auth: {
      domain: "noipm.auth0.com",
      clientID: "2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI",
      redirectUri: `http://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "https://noipm-staging.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname",
      rolesKey: "https://noipm-staging.herokuapp.com/roles"
    },
    hostname: ""
  },
  static_development: {
    auth: {
      domain: "noipm.auth0.com",
      clientID: "2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI",
      redirectUri: `http://localhost:${PORT}/callback`,
      audience: "https://noipm-staging.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname",
      rolesKey: "https://noipm-staging.herokuapp.com/roles"
    },
    hostname: ""
  },
  test: {
    auth: {
      domain: "noipm.auth0.com",
      clientID: "2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI",
      redirectUri: `http://localhost:${LOCAL_DEV_PORT}/callback`,
      audience: "test audience",
      responseType: "token id_token",
      scope: "openid profile read:cases",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname",
      rolesKey: "https://noipm-staging.herokuapp.com/roles"
    },
    hostname: "http://localhost"
  },
  staging: {
    auth: {
      domain: "noipm.auth0.com",
      clientID: "2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI",
      redirectUri: "https://noipm-staging.herokuapp.com/callback",
      audience: "https://noipm-staging.herokuapp.com/",
      responseType: "token id_token",
      scope: "openid profile",
      nicknameKey: "https://noipm-staging.herokuapp.com/nickname",
      rolesKey: "https://noipm-staging.herokuapp.com/roles"
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
      nicknameKey: "https://noipm-production.herokuapp.com/nickname",
      rolesKey: "https://noipm-production.herokuapp.com/roles",
    },
    hostname: ""
  }
};
