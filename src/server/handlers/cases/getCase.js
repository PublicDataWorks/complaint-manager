const models = require('../../models/index')

const getCase = async (req, res) => {
    const singleCase = await models.cases.findById(req.params.id,
        {
            include: [
                {
                    model: models.civilian,
                    include: [models.address]
                },
                {
                    model: models.attachment
                },
                {
                    model: models.address,
                    as: 'incidentLocation'
                },
                {
                    model: models.case_officer,
                    as: 'accusedOfficers',
                    include: [models.officer]
                }
            ]
        })

    res.send(singleCase)
}

module.exports = getCase