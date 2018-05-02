const models = require('../../models/index')

const getRecentActivity = async (request, response, next) => {
    try {
        const recentActivity = await models.user_action.findAll({
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