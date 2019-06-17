import { UNAUTHORIZED_ERRORS } from "../../sharedUtilities/errorMessageConstants";

const config = require("../config/config")[process.env.NODE_ENV];
const Boom = require("boom");

const verifyUserNickname = (request, response, next) => {
  const userInfo = request.user;

  if (!userInfo || !userInfo[config.authentication.nicknameKey]) {
    return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_NICKNAME_MISSING));
  }
  if (!userInfo.scope) {
    return next(Boom.unauthorized(UNAUTHORIZED_ERRORS.USER_SCOPE_MISSING));
  }

  request.nickname = userInfo[config.authentication.nicknameKey];
  request.permissions = userInfo.scope.split(" ");

  next();
};

module.exports = verifyUserNickname;
