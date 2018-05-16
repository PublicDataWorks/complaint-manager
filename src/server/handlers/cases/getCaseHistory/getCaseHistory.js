const models = require('../../../models');

const getCaseHistory = async (request, response, next) => {
    try {
        const caseId = request.params.id;
        const audits = await models.data_change_audit.findAll({
            where: {caseId: caseId},
            attributes: ['id', 'action', 'modelName', 'modelId', 'changes', 'user', 'createdAt', 'caseId'],
            order: [['createdAt', 'desc']],
            raw: true
        });
        response.status(200).send(audits);
    } catch (error) {
        next(error);
    }
};

module.exports = getCaseHistory;
