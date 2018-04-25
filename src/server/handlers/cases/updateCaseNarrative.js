const models = require('../../models/index')

const updateCaseNarrative = async (request, response, next) => {
    try {
        const caseId = request.params.id

        const updatedCase = await models.sequelize.transaction(async (t) => {
            await models.cases.update({
                    narrativeDetails: request.body.narrativeDetails,
                    narrativeSummary: request.body.narrativeSummary
                },
                {
                    where: { id: caseId },
                    individualHooks: true,
                    transaction: t
                })


            await models.audit_log.create({
                    caseId: caseId,
                    user: request.nickname,
                    action: `Narrative updated`
                },
                {
                    transaction: t
                })

            return await models.cases.findById(
                caseId,
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
                            model: models.case_officer,
                            as: 'accusedOfficers',
                            include: [models.officer]
                        }
                    ],
                    transaction: t
                }
            )
        })

        response.send(updatedCase)
    } catch (e) {
        next(e)
    }
}

module.exports = updateCaseNarrative