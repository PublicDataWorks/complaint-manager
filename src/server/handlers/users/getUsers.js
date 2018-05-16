const models = require("../../models/index");

const getUsers = async (req, res) => {
  const users = await models.users.findAll();
  res.send({ users });
};

module.exports = getUsers;
