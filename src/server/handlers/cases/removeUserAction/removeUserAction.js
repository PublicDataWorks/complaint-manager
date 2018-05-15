const models = require("../../../models");
const getCaseWithAllAssociations = require('../../getCaseWithAllAssociations')

const removeUserAction = async (req, res, next) => {

    try {
        const caseId = req.params.caseId
        const userActionId = req.params.userActionId

        const currentCase = await models.sequelize.transaction(async (transaction) => {
            await models.user_action.destroy({
                where: {
                    id: userActionId
                },
            }, {transaction})


            await models.cases.update({
                status: "Active"
            }, {
                where: {
                    id: caseId
                }
            }, {transaction})

            const caseDetails = await getCaseWithAllAssociations(caseId, transaction)
            const recentActivity = await models.user_action.findAll({where: {caseId}}, {transaction})

            return {
                caseDetails, recentActivity
            }

        })
        res.status(200).send(currentCase)
    } catch (error) {
        next(error)
    }
}

module.exports = removeUserAction