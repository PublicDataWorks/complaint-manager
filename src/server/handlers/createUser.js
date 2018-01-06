const models = require('../models');
const generatePassword = require('password-generator');

const createUser = async (request, response) => {
  const userToCreate = {
    password: generatePassword(12),
    ...request.body
  };

  const createdUser = await models.users.create(userToCreate);

  delete createdUser.password

  response
    .status(201)
    .send(createdUser)
}

module.exports = createUser