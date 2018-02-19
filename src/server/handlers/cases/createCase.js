const _ = require('lodash')
const models = require('../../models/index')
const AuthClient = require('auth0').AuthenticationClient

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

            const auth = new AuthClient({
                domain: "noipm.auth0.com"
            })

            const accessToken = req.headers.authorization.split(' ')[1]

            const userInfo = await auth.users.getInfo(accessToken)

            await models.audit_log.create({
                action: `Case ${createdCase.id} created`,
                caseId: createdCase.id,
                user: userInfo.nickname,
            })

            res.status(201).send(createdCase)
        }
    } catch (e) {
        next(e)
    }
}

module.exports = createCase