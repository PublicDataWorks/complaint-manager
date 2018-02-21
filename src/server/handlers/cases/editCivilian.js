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

            await models.audit_log.create({
                    action: `Civilian ${civilian.id} updated`,
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
