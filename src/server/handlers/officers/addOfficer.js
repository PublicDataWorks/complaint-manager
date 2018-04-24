const models = require('../../models/index');

const addOfficer = async (request, response, next) => {
    try {
        const retrievedCase = await models.cases.findById(request.params.caseId)
        const retrievedOfficer = await models.officer.findById(request.params.officerId)

        const caseOfficerAttributes = {notes: request.body.notes, roleOnCase: request.body.roleOnCase};
        const updatedCase = await models.sequelize.transaction(async (t) => {
            await retrievedCase.addOfficer(retrievedOfficer, {through: caseOfficerAttributes, transaction: t});

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