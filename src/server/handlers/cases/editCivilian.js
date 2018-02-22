const models = require('../../models/index')

const editCivilian = async (req, res, next) => {
    try {
        const updatedCivilian = await models.sequelize.transaction(async (t) => {
            const updatedCivilianWithSequelizeMarkup = await models.civilian.update(
                req.body,
                {
                    where: {id: req.params.id},
                    returning: true,
                    transaction: t
                })

            const civilian = updatedCivilianWithSequelizeMarkup[1][0]['dataValues']

            //update case status with caseId to from 'Initial' to 'Active'
            await models.cases.update(
                {status: 'Active'},
                {
                    where: {id: civilian.caseId},
                    transaction: t
                })

            await models.audit_log.create({
                    action: `Civilian updated`,
                    caseId: civilian.caseId,
                    user: req.nickname
                },
                {
                    transaction: t
                })

            return civilian
        })

        res.status(200).send(updatedCivilian)

    } catch (e) {
        next(e)
    }
}

module.exports = editCivilian
