import OktaAuth from "@okta/okta-auth-js";
const config =
    require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
        process.env.NODE_ENV
        ];

export const logout = (history) => {
    new OktaAuth({
        issuer: config.auth.issuer,
        clientId: config.auth.clientID,
        redirectUri: config.auth.redirectUri,
        responseType: "code"
    }).signOut();
}
