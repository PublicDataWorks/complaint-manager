const models = require('../../models/index');

const logout = async (request, response, next) => {
    try {
        await models.sequelize.transaction(async (t) => {

            await models.audit_log.create({
                action: `Logged Out`,
                caseId: null,
                user: request.nickname,
            }, {transaction: t});
        });

        response.status(201).send()

    } catch (e) {
        next(e)
    }
};

module.exports = logout;