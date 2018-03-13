const models = require('../../models/index')

const getCase = async (req, res) => {
    const singleCase = await models.cases.findById(req.params.id,
        {
            include: [
                {
                    model: models.civilian,
                    include: [models.address]
                },
                {model: models.attachment}
            ]
        })

    res.send(singleCase)
}

module.exports = getCase