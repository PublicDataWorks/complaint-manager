import auth0 from "auth0-js";
import history from "../../history";
import auditLogin from "../../policeDataManager/users/thunks/auditLogin";
import { parsePermissions, logout } from "../../auth";
import jwt from "jsonwebtoken";
import generateRandomString from "../../policeDataManager/utilities/generateRandomString";
import { NICKNAME, PERMISSIONS } from "../../../sharedUtilities/constants";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

export default class Auth {
  authConfig = config[process.env.REACT_APP_ENV].auth;
  authWeb = new auth0.WebAuth(this.authConfig);

  login = () => {
    const nonce = generateRandomString();
    this.authWeb.authorize({ state: nonce });
    localStorage.setItem("nonce", nonce);
  };

  handleAuthentication = (
    populateStoreWithUserInfoCallback,
    getFeatureTogglesCallback
  ) => {
    this.authWeb.parseHash((err, authResult) => {
      if (
        authResult &&
        authResult.accessToken &&
        authResult.idToken &&
        authResult.state === localStorage.getItem("nonce")
      ) {
        this.setUserInfoInStore(
          authResult.accessToken,
          populateStoreWithUserInfoCallback
        );
        this.setSession(authResult);
        auditLogin();
        getFeatureTogglesCallback();
        const redirectUri = localStorage.getItem("redirectUri");
        history.replace(redirectUri ? redirectUri : "/");
        localStorage.removeItem("nonce");
        localStorage.removeItem("redirectUri");
      } else if (err) {
        history.replace("/");
        console.log(err);
      }
    });
  };

  setSession = authResult => {
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");

    logout(history);
  };

  setUserInfoInStore = (accessToken, populateStoreWithUserInfoCallback) => {
    const decodedToken = jwt.decode(accessToken);
    const permissions = parsePermissions(decodedToken);
    const nickname = decodedToken[this.authConfig.nicknameKey];
    populateStoreWithUserInfoCallback({ nickname, permissions });
  };

  setDummyUserInfoInStore = populateStoreWithUserInfoCallback => {
    populateStoreWithUserInfoCallback({
      nickname: NICKNAME,
      permissions: PERMISSIONS
    });
  };
}
