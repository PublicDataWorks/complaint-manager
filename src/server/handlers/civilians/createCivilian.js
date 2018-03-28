const models = require("../../models")

const createCivilian = async (req, res, next) => {

    try {
        const allCivilians = await models.sequelize.transaction(async (t) => {
            const civilianCreated = await models.civilian.create(
                req.body
                , {
                    include: [{ model: models.address }],
                    transaction: t
                }
            )

            await models.audit_log.create({
                    action: `Civilian created`,
                    caseId: civilianCreated.caseId,
                    user: req.nickname
                },
                {
                    transaction: t
                }
            )

            return await models.civilian.findAll({
                include: [{ model: models.address }],
                where: {
                    caseId: civilianCreated.caseId
                },
                transaction: t
            })
        })

        res.status(201).send(allCivilians)

    } catch (e) {
        next(e)
        // How to manage adding a civilian to a case that doesn't exist
    }


}

module.exports = createCivilian