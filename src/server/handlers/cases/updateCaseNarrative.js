const models = require('../../models/index')

const updateCaseNarrative = async (request, response, next) => {
    try {
        const caseId = request.params.id

        await models.cases.update({
                narrative: request.body.narrative,
            },
            {
                where: {id: caseId},
                individualHooks: true
            })

        const updatedCase = await models.cases.findById(
            caseId,
            {
                include: [{model: models.civilian}]
            }
        )

        await models.audit_log.create({
            caseId: caseId,
            user: request.nickname,
            action: `Case ${caseId} narrative updated`
        })

        response.send(updatedCase)
    } catch (e) {
        next(e)
    }
}

module.exports = updateCaseNarrative