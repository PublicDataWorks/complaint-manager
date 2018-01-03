const models = require('../models')

const getCases = async (req, res) => {
    const cases = await models.cases.findAll()
    res.send({ cases })
};

module.exports = getCases