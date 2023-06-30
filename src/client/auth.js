const clientConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const { Login } = require(`../auth/${clientConfig.auth.engine}/Login`);

export { Login };
