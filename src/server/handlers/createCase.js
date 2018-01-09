const models = require('../models')

const invalidName = (input) => {
    return (!input || input.length == 0 || input.length > 25)
}

const createCase = async (req, res, next) => {
    try {
        //  TODO extract validation logic
        if (invalidName(req.body.firstName) || invalidName(req.body.lastName)) {
            res.sendStatus(400)
        }
        else {
            const createdCase = await models.cases.create(req.body)
            res.status(201).send(createdCase)
        }
    } catch (e) {
        next(e)
    }
}

module.exports = createCase