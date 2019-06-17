import auth0 from "auth0-js";
import config from "../config/config";
import history from "../history";
import auditLogin from "../users/thunks/auditLogin";
import parsePermissions from "../utilities/parsePermissions";
import jwt from "jsonwebtoken";

export default class Auth {
  authConfig = config[process.env.REACT_APP_ENV].auth;
  authWeb = new auth0.WebAuth(this.authConfig);

  login = () => {
    this.authWeb.authorize();
  };

  handleAuthentication = (
    populateStoreWithUserInfoCallback,
    getFeatureTogglesCallback
  ) => {
    this.authWeb.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setUserInfoInStore(
          authResult.accessToken,
          populateStoreWithUserInfoCallback
        );
        this.setSession(authResult);
        auditLogin();
        getFeatureTogglesCallback();
        history.replace("/");
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

    history.push("/login");
  };

  setUserInfoInStore = (accessToken, populateStoreWithUserInfoCallback) => {
    const decodedToken = jwt.decode(accessToken);
    const permissions = parsePermissions(decodedToken.scope);
    const nickname = decodedToken[this.authConfig.nicknameKey];
    populateStoreWithUserInfoCallback({ nickname, permissions });
    console.log(
      "setUserInfoInStore:\n",
      "Permissions:",
      permissions,
      "\nNickname: ",
      nickname
    );
  };
}
