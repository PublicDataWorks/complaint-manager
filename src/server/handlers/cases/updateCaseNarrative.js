const models = require('../../models/index')

const updateCaseNarrative = async (request, response, next) => {
    try {
        await models.cases.update({
                narrative: request.body.narrative,
            },
            {
                where: {id: request.params.id},
                individualHooks: true
            })

        const updatedCase = await models.cases.findById(
            request.params.id,
            {
                include: [{model: models.civilian}]
            }
        )

        response.send(updatedCase)
    } catch (e) {
        next(e)
    }
}

module.exports = updateCaseNarrative