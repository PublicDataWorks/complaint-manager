const models = require('../../models/index')

const editCivilian = async (req, res, next) => {

    async function upsertAddress(civilianId, address, transaction) {
        const civilian = await models.civilian.find({
            where: {id: civilianId},
            transaction
        })

        if (!civilian.addressId) {
            const createdAddress = await models.address.create(
                {
                    ...address,
                }, {
                    transaction
                })

            await civilian.setAddress(createdAddress, {transaction})
        } else {
            await models.address.update(
                address,
                {
                    where: {id: civilian.addressId},
                    transaction
                })
        }
    }

    try {
        const updatedCivilian = await models.sequelize.transaction(async (t) => {
            const {addressId, ...other} = req.body

            if (req.body.address) {
                await upsertAddress(req.params.id, req.body.address, t);
            }

            const updatedCivilian = await models.civilian.update(
                other,
                {
                    where: {id: req.params.id},
                    transaction: t,
                    returning: true,
                })
            const caseId = updatedCivilian[1][0].dataValues.caseId


            const civilians = await models.civilian.findAll({
                where: {caseId: caseId},
                transaction: t,
                include: [{model: models.address}]
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
