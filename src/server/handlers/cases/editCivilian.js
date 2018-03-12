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
            await models.civilian.update(
                req.body,
                {
                    where: {id: req.params.id},
                    transaction: t
                })
            await upsertAddress(req.params.id, req.body.address, t);

            const civilian = await models.civilian.findById(req.params.id, {
                transaction: t,
                include:[{model:models.address}]
            })

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
        // TODO: return back the entire Case object instead of civilian
        res.status(200).send(updatedCivilian)

    } catch (e) {
        next(e)
    }
}

module.exports = editCivilian
