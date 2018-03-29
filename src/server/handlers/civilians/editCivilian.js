const models = require('../../models/index')

const editCivilian = async (req, res, next) => {

    async function upsertAddress(civilianId, address, transaction) {
        const addressToUpdate = await models.address.find({
            where: {civilianId: civilianId},
            transaction
        })

        if (!addressToUpdate) {
            await models.address.create(
                {
                    ...address,
                    civilianId
                },{
                    transaction
                })
        } else {
            await models.address.update(
                address,
                {
                    where: {civilianId},
                    transaction
                })
        }
    }

    try {
        const updatedCivilian = await models.sequelize.transaction(async (t) => {
            const updatedCivilian = await models.civilian.update(
                req.body,
                {
                    where: {id: req.params.id},
                    transaction: t,
                    returning: true,
                })
            const caseId = updatedCivilian[1][0].dataValues.caseId

            await upsertAddress(req.params.id, req.body.address, t);

            const civilians = await models.civilian.findAll({
                where: {caseId: caseId},
                transaction: t,
                include:[{model:models.address}]
            })

            await models.cases.update(
                {status: 'Active'},
                {
                    where: {id: caseId},
                    transaction: t
                })

            await models.audit_log.create({
                    action: `Civilian updated`,
                    caseId: caseId,
                    user: req.nickname
                },
                {
                    transaction: t
                })

            return civilians
        })
        res.status(200).send(updatedCivilian)

    } catch (e) {
        next(e)
    }
}

module.exports = editCivilian
