const config = require("../config/config")[process.env.NODE_ENV];
const Boom = require("boom");

const verifyUserNickname = (request, response, next) => {
  const userInfo = request.user;
  if (!userInfo || !userInfo[config.authentication.nicknameKey]) {
    return next(Boom.unauthorized("User nickname missing"));
  }

  request.nickname = userInfo[config.authentication.nicknameKey];
  next();
};

module.exports = verifyUserNickname;
