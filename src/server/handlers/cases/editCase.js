const moment = require("moment")

const models = require('../../models')

const editCase = async (request, response, next) => {

    try {
        if(!request.body.firstContactDate || !moment(request.body.firstContactDate).isValid()) {
            response.status(400).json({ error: "firstContactDate is required"});
        }

        else {
            const updatedCase = await models.sequelize.transaction(async (transaction) => {
                await models.cases.update(request.body,
                    {
                        where: {id: request.params.id},
                        transaction,
                    })

                await models.audit_log.create({
                    action: 'Incident details updated',
                    caseId: request.params.id,
                    user: request.nickname
                },
                {
                    transaction
                })

                return await models.cases.findById(
                    request.params.id,
                    {
                        include: [
                            {
                                model: models.civilian,
                                include: [models.address]
                            },
                            {
                                model: models.attachment
                            }
                        ],
                        transaction: transaction
                    }
                )
            })
            response.status(200).send(updatedCase)
        }
    } catch(error) {
        next(error);
    }
}

module.exports = editCase;