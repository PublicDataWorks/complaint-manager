const models = require('../../models/index');

const addOfficer = async (request, response, next) => {
    try {

        const updatedCase = await models.sequelize.transaction(async (t) => {

            const retrievedCase = await models.cases.findById(request.params.caseId, {transaction: t})
            const retrievedOfficer = await models.officer.findById(request.params.officerId, {transaction: t})

            const caseOfficer = await retrievedCase.addOfficer(retrievedOfficer, {transaction: t})

            await models.audit_log.create({
                    action: `Accused Officer Added`,
                    caseId: request.params.caseId,
                    user: request.nickname
                },
                {
                    transaction: t
                }
            )

            return await models.cases.findById(retrievedCase.id,
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
                    ],
                    transaction: t
                })
        })

        return response.send(updatedCase)

    } catch (e) {
        next(e)
    }
}


module.exports = addOfficer