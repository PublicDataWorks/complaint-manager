const models = require('../../models/index')

const getCases = async (req, res) => {
    const cases = await models.cases.findAll()
    res.send({ cases })
};

module.exports = getCases