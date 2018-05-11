const models = require('../../models/index');
const getCaseWithAllAssociations = require('../getCaseWithAllAssociations');

const addCaseOfficer = async (request, response, next) => {
    try {
        const retrievedCase = await models.cases.findById(request.params.caseId)
        const caseOfficerAttributes = {
            notes: request.body.notes,
            roleOnCase: request.body.roleOnCase,
            officerId: request.body.officerId
        };

        const updatedCase = await models.sequelize.transaction(async (t) => {
            await retrievedCase.createAccusedOfficer(caseOfficerAttributes, {transaction: t});

            await models.audit_log.create({
                    action: `Officer Added as ${request.body.roleOnCase}`,
                    caseId: request.params.caseId,
                    user: request.nickname
                },
                {
                    transaction: t
                }
            )

            await models.cases.update({status:'Active'}, {
                where:{
                    id: request.params.caseId
                }
            })

            return await getCaseWithAllAssociations(retrievedCase.id, t)
        })

        return response.send(updatedCase)

    } catch (e) {
        next(e)
    }
}


module.exports = addCaseOfficer