const models = require('../../models/index')

const getCases = async (req, res) => {
    const cases = await models.cases.findAll(
        {
            include: [{
                model: models.civilian,
                where: {roleOnCase: 'Complainant'}} ]
        })

    res.send({cases})
};

module.exports = getCases