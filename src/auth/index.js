const serverConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

const jwtCheck =
  process.env.NODE_ENV === "test"
    ? require("./auth0/jwtCheck") // only the auth0 jwt check is currently setup for mocking
    : require(`./${serverConfig.authentication.engine}/jwtCheck`);

const userService = require(`./${serverConfig.authentication.engine}/userService`);

export { jwtCheck, userService };
