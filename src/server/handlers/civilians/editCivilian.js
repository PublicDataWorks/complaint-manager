const models = require('../../models/index')

async function upsertAddress(civilianId, addressId, address, transaction) {

    if (!addressId) {
        const createdAddress = await models.address.create(
            {
                ...address,
            }, {
                transaction
            })

        await models.civilian.update({
            addressId: createdAddress.id
        }, {
            where: {id: civilianId},
            transaction
        })
    } else {
        await models.address.update(
            address,
            {
                where: {id: addressId},
                transaction
            })
    }
}

const editCivilian = async (req, res, next) => {

    try {
        const updatedCivilian = await models.sequelize.transaction(async (t) => {
            const {addressId, address, ...civilianValues} = req.body

            //if there are address values to update
            if (address) {
                await upsertAddress(civilianValues.id, addressId, address, t);
            }

            const updatedCivilian = await models.civilian.update(
                civilianValues,
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
