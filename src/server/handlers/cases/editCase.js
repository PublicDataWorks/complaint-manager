const moment = require("moment")

const models = require('../../models')

const editCase = async (request, response, next) => {

    try {
        if(!request.body.firstContactDate || !moment(request.body.firstContactDate).isValid()) {
            response.sendStatus(400);
        }

        else {
            return await models.sequelize.transaction(async (transaction) => {
                await models.cases.update(request.body,
                    {
                        where: {id: request.params.id},
                        transaction
                    })

                await models.audit_log.create({
                    action: 'Incident details updated',
                    caseId: request.params.id,
                    user: request.nickname
                },
                {
                    transaction
                })
            })
        }
    } catch(error) {
        next(error);
    }
}

module.exports = editCase;