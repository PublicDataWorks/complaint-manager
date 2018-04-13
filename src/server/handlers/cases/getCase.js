const models = require('../../models/index')

const getCase = async (req, res) => {
    const singleCase = await models.cases.findById(req.params.id,
        {
            include: [
                {
                    model: models.civilian,
                    include: [models.address]
                },
                {model: models.attachment},
                {
                    model: models.address,
                    as: 'incidentLocation'
                }
            ]
        })

    res.send(singleCase)
}

module.exports = getCase