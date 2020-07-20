import { UNAUTHORIZED_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import checkFeatureToggleEnabled from "../checkFeatureToggleEnabled";

const config = require("../config/config")[process.env.NODE_ENV];
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
    request.nickname = "noipm.infrastructure@gmail.com";
    request.permissions = "openid profile export:audit-log update:case-status".split(
      " "
    );
    next();
  } else {
    if (!userInfo[config.authentication.nicknameKey]) {
      return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_NICKNAME_MISSING));
    }

    if (!userInfo.scope) {
      return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_SCOPE_MISSING));
    }

    request.nickname = userInfo[config.authentication.nicknameKey];
    request.permissions = userInfo.scope.split(" ");

    next();
  }
};

module.exports = verifyUserNickname;
