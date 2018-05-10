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
                    include: [{
                        model: models.officer,
                        include: [{
                            model: models.officer,
                            as: 'supervisor'
                        }]
                    }]
                },
                {
                    model: models.case_officer,
                    as: 'complainantWitnessOfficers',
                    include: [models.officer]
                }
            ],
            transaction: transaction
        })
}

module.exports = getCaseWithAllAssociations