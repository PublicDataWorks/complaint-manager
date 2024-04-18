import { getPermissions } from "../../auth";
import { NICKNAME, PERMISSIONS } from "../../sharedUtilities/constants";
import { UNAUTHORIZED_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import checkFeatureToggleEnabled from "../checkFeatureToggleEnabled";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];
const Boom = require("boom");

const verifyUserNickname = (request, response, next) => {
  const userInfo = request.user;
  const nonUserAuthenticationFeature = checkFeatureToggleEnabled(
    request,
    "nonUserAuthenticationFeature"
  );

  if (!userInfo) {
    return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_INFO_MISSING));
  }

  if (nonUserAuthenticationFeature && userInfo["gty"] == "client-credentials") {
    request.nickname = NICKNAME;
    request.permissions = PERMISSIONS;
    next();
  } else {
    if (!userInfo[config.authentication.nicknameKey]) {
      return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_NICKNAME_MISSING));
    }

    if (!userInfo.scope) {
      return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_SCOPE_MISSING));
    }

    if (userInfo.permissions && !Array.isArray(userInfo.permissions)) {
      return next(
        Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_PERMISSIONS_MISSING)
      );
    }

    request.nickname = userInfo[config.authentication.nicknameKey];
    request.permissions = getPermissions(userInfo.permissions, userInfo.scope);

    next();
  }
};

module.exports = verifyUserNickname;
