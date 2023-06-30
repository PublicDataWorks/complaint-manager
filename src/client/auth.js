const clientConfig =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const { Callback } = require(`../auth/${clientConfig.auth.engine}/Callback`);
const { Login } = require(`../auth/${clientConfig.auth.engine}/Login`);
const {
  parsePermissions
} = require(`../auth/${clientConfig.auth.engine}/parsePermissions`);
const {
  withSecurity
} = require(`../auth/${clientConfig.auth.engine}/withSecurity`);

export { Callback, Login, parsePermissions, withSecurity };
