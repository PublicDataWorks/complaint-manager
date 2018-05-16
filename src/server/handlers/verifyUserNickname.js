const config = require("../config/config")[process.env.NODE_ENV];
const httpContext = require("express-http-context");

const verifyUserNickname = (request, response, next) => {
  const userInfo = request.user;
  if (!userInfo || !userInfo[config.authentication.nicknameKey]) {
    const err = new Error("User nickname missing");
    err.name = "UserNicknameFetchError";
    return next(err);
  }
  request.nickname = userInfo[config.authentication.nicknameKey];
  httpContext.set("userNickname", userInfo[config.authentication.nicknameKey]);
  next();
};

module.exports = verifyUserNickname;
