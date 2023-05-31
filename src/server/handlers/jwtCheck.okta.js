import OktaJwtVerifier from "@okta/jwt-verifier";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

const oktaJwtCheck = (request, response, next) => {
  const verifier = new OktaJwtVerifier({
    issuer: `${config.authentication.issuer}`
  });

  verifier
    .verifyAccessToken(getToken(request), config.authentication.audience)
    .then(jwt => {
      request.user = {
        sub: jwt.claims.sub,
        scope: jwt.claims.scp.join(" ")
      };
      next();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
};

const getToken = request => {
  if (
    request.headers.authorization &&
    request.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return request.headers.authorization.split(" ")[1];
  } else if (request.query && request.query.token) {
    return request.query.token;
  }
  return null;
};

export default oktaJwtCheck;
