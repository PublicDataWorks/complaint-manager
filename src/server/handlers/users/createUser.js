const models = require('../../models/index');
const generatePassword = require('password-generator');

const createUser = async (request, response, next) => {
    try {
        const userToCreate = {
            password: generatePassword(12),
            ...request.body
        };

        const createdUser = await models.users.create(userToCreate);

        response
            .status(201)
            .send(createdUser)
    } catch (e) {
        next(e)
    }
}

module.exports = createUser