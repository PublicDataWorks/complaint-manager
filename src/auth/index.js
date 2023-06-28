const clientConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];
const serverConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

console.log(process.env.NODE_ENV, serverConfig);
const jwtCheck =
  process.env.NODE_ENV === "test"
    ? require("./auth0/jwtCheck") // only the auth0 jwt check is currently setup for mocking
    : require(`./${serverConfig.authentication.engine}/jwtCheck`);

export { jwtCheck };
