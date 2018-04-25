const models = require('../../models/index');

const addOfficer = async (request, response, next) => {
    try {
        const retrievedCase = await models.cases.findById(request.params.caseId)
        const caseOfficerAttributes = {
            notes: request.body.notes,
            roleOnCase: request.body.roleOnCase,
            officerId: request.params.officerId
        };

        await models.sequelize.transaction(async (t) => {
            await retrievedCase.createAccusedOfficer(caseOfficerAttributes, {transaction: t});

            await models.audit_log.create({
                    action: `Accused Officer Added`,
                    caseId: request.params.caseId,
                    user: request.nickname
                },
                {
                    transaction: t
                }
            )
        })

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
                        model: models.case_officer,
                        as: 'accusedOfficers',
                        include: [models.officer]
                    }
                ]
            })

        return response.send(updatedCase)

    } catch (e) {
        next(e)
    }
}


module.exports = addOfficer