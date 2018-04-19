const models = require('../../models/index');

const addOfficer = async (request, response, next) => {
    try {
        const retrievedCase = await models.cases.findById(request.params.caseId)
        const retrievedOfficer = await models.officer.findById(request.params.officerId)

        const caseOfficer = await retrievedCase.addOfficer(retrievedOfficer)

        const updatedCase = await models.cases.findById(retrievedCase.id,
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
                        model: models.officer
                    }
                ]
            })

            return response.send(updatedCase)

    } catch (e) {
        next(e)
    }
}


module.exports = addOfficer