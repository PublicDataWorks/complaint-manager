const models = require('../../models/index')

const updateCaseNarrative = async (request, response, next) => {
    const update = await models.cases.update({
        narrative: request.body.narrative,
        }, {
        where: { id: request.params.id },
        returning: true,
        plain: true
    })

    response.send(update[1].dataValues)
}


module.exports = updateCaseNarrative