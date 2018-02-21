const models = require('../../models/index')

const editCivilian = async (req, res, next) => {
    try {
        const updatedCivilianWithSequelizeMarkup = await models.civilian.update({...req.body}, {
            where: {id: req.params.id},
            returning: true
        })

        const civilian = updatedCivilianWithSequelizeMarkup[1][0]['dataValues']
        res.status(200).send(civilian)

    } catch (e) {
        next(e)
    }
}

module.exports = editCivilian
