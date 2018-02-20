const models = require('../../models/index')

const invalidName = (input) => {
    return (!input || input.length == 0 || input.length > 25)
}

const createCase = async (req, res, next) => {
    try {
        //  TODO extract validation logic
        if (invalidName(req.body.civilian.firstName) || invalidName(req.body.civilian.lastName)) {
            res.sendStatus(400)
        }
        else {
            const createdCase = await models.cases.create({
                ...req.body.case,
                civilians: [req.body.civilian]
            },{
                include: [{
                    model: models.civilian
                }]
            })

            await models.audit_log.create({
                action: `Case ${createdCase.id} created`,
                caseId: createdCase.id,
                user: req.nickname,
            })

            res.status(201).send(createdCase)
        }
    } catch (e) {
        next(e)
    }
}

module.exports = createCase