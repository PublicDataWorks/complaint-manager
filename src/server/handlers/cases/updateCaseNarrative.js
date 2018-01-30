const models = require('../../models/index')

const updateCaseNarrative = async (request, response, next) => {
    const caseToUpdate = await models.cases.findById(request.params.id)
    const update = await caseToUpdate.update({
        narrative: request.body.narrative,
    })

    response.send(update)
}


module.exports = updateCaseNarrative