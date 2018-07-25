import auth0 from "auth0-js";
import config from "../config/config";
import history from "../history";
import auditLogin from "../users/thunks/auditLogin";
import parsePermissions from "../utilities/parsePermissions";
import jwt from "jsonwebtoken";

export default class Auth {
  getAuthConfig = () => {
    if (process.env.REACT_APP_ENV === "static_development") {
      return config[process.env.REACT_APP_ENV].auth;
    }
    return config[process.env.NODE_ENV].auth;
  };
  authWeb = new auth0.WebAuth(this.getAuthConfig());

  login = () => {
    this.authWeb.authorize();
  };

  handleAuthentication = callback => {
    this.authWeb.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setUserInfo(authResult.accessToken, callback);
        this.setSession(authResult);
        auditLogin();
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

    history.replace("/");
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");

    history.push("/login");
  };

  setUserInfo = (accessToken, callback) => {
    const decodedToken = jwt.decode(accessToken);
    const permissions = parsePermissions(decodedToken.scope);
    const nickname = decodedToken[this.getAuthConfig().nicknameKey];
    callback({ nickname, permissions });
  };
}
