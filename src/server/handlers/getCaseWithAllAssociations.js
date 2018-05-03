const models = require('../models')

const getCaseWithAllAssociations = async (caseId, transaction = null) => {
    return await models.cases.findById(caseId,
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
            ],
            transaction: transaction
        })
}

module.exports = getCaseWithAllAssociations