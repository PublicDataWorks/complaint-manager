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

        await models.sequelize.transaction(async (t) => {
            await models.civilian.destroy({ where: {id: request.params.civilianId}}, {transaction: t})
            await models.address.destroy({ where: {id: civilian.dataValues.addressId}}, {transaction: t})
            await models.cases.update({status: 'Active'}, { where: {id: request.params.caseId}}, {transaction: t})
        })

        const caseDetails = await getCaseWithAllAssociations(request.params.caseId)

        response.status(200).send(caseDetails)
    }
    catch (error) {
        next(error)
    }
}

module.exports = removeCivilian