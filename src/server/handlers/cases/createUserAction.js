const models = require("../../models")

const createUserAction = async (request, response, next) => {
    try {
        await models.user_action.create({
            ...request.body,
            user: request.nickname,
            caseId: request.params.id
        })

        const recentActivity = await models.user_action.findAll({
            where: {
                caseId: request.params.id
            }
        })

        response.status(201).send(recentActivity)
    }
    catch (error) {
        next(error)
    }
}

module.exports = createUserAction