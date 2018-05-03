const models = require("../../models")
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations")

const removeCivilian = async (request, response, next) => {
    try {
        await models.civilian.destroy({ where: {id: request.params.civilianId}})

        const caseDetails = await getCaseWithAllAssociations(request.params.caseId)

        response.status(200).send(caseDetails)
    }
    catch (error) {
        next(error)
    }
}

module.exports = removeCivilian