const serverConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

const jwtCheck =
  process.env.NODE_ENV === "test"
    ? require("./auth0/jwtCheck") // only the auth0 jwt check is currently setup for mocking
    : require(`./${serverConfig.authentication.engine}/jwtCheck`);
("./okta/jwtCheck");

const userService = require(`./${serverConfig.authentication.engine}/userService`);

const getPermissions = (permissions, scope = "") => {
  return Array.isArray(permissions) ? permissions : scope.split(" ");
};

export { jwtCheck, userService, getPermissions };
