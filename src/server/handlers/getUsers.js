const models = require('../models')

const getUsers = async (req, res) => {
    const users = await models.users.findAll()
    res.send({ users })
}

module.exports = getUsers