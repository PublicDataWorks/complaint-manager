const models = require('../../models/index')

const getRecentActivity = async (request, response, next) => {
    try {
        const recentActivity = await models.audit_log.findAll({
            where: {
                caseId: request.params.id
            }
        })

        response.send(recentActivity)
    }
    catch (error) {
        next(error)
    }
}

module.exports = getRecentActivity