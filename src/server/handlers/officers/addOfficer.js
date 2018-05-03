const models = require('../../models/index');
const getCaseWithAllAssociations = require('../getCaseWithAllAssociations');

const addOfficer = async (request, response, next) => {
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
                    action: `Accused Officer Added`,
                    caseId: request.params.caseId,
                    user: request.nickname
                },
                {
                    transaction: t
                }
            )

            return await getCaseWithAllAssociations(retrievedCase.id, t)
        })

        return response.send(updatedCase)

    } catch (e) {
        next(e)
    }
}


module.exports = addOfficer