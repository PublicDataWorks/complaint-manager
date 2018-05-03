const models = require("../../models")
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations")

const removeCivilian = async (request, response, next) => {
    try {
        const civilian = await models.civilian.findById(request.params.civilianId, {
            include: [
                {
                    model: models.address,
                }]
        })

        await models.civilian.destroy({ where: {id: request.params.civilianId}})
        await models.address.destroy({ where: {id: civilian.dataValues.addressId}})

        const caseDetails = await getCaseWithAllAssociations(request.params.caseId)

        response.status(200).send(caseDetails)
    }
    catch (error) {
        next(error)
    }
}

module.exports = removeCivilian