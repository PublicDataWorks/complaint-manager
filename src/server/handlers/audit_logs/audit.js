const models = require('../../models/index');

const audit = async (request, response, next) => {
    try {
        await models.sequelize.transaction(async (t) => {
            await models.audit_log.create({
                action: request.body.log,
                caseId: null,
                user: request.nickname,
            }, {transaction: t});
        });

        response.status(201).send()

    } catch (e) {
        next(e)
    }
};

module.exports = audit;