const models = require('../../models/index')
const moment = require('moment')

const invalidName = (input) => {
    return (!input || input.length === 0 || input.length > 25)
}

const createCase = async (req, res, next) => {
    try {
        //  TODO extract validation logic
        if (invalidName(req.body.civilian.firstName) || invalidName(req.body.civilian.lastName)) {
            res.sendStatus(400)
        }
        else {
            //TODO When we refactor the request to nest civilian under case, we may be able to get rid of this mapping logic
            //we should be able to simply say: const createdCase = await models.cases.create({req.body.case})
            const createdCase = await models.sequelize.transaction(async (t) => {
                const createdCase = await models.cases.create({
                    ...req.body.case,
                    civilians: [req.body.civilian]
                }, {
                    include: [{
                        model: models.civilian
                    }],
                    transaction: t
                })

                await models.audit_log.create({
                    action: `Case created`,
                    caseId: createdCase.id,
                    user: req.nickname,
                }, {transaction: t})

                return createdCase
            })

            const incidentDate = createdCase.getDataValue('incidentDate')
            const normalizedIncidentDate = moment(incidentDate).format('YYYY-MM-DDTHH:mm')
            createdCase.setDataValue('incidentDate', normalizedIncidentDate)

            res.status(201).send(createdCase)
        }
    } catch (e) {
        next(e)
    }
}

module.exports = createCase