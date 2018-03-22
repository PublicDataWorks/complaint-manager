const models = require('../../../models/index')

const deleteAttachment =  async (request, response) => {
    const caseDetails = await models.sequelize.transaction(async (t) => {

        await models.attachment.destroy({
            where: {
                fileName: request.params.fileName
            },
            transaction: t
        })

        return await models.cases.findById(request.params.id,
            {
                include: [
                    {model: models.civilian},
                    {model: models.attachment}
                ],
                transaction: t
            })
    })

    response.status(200).send(caseDetails)
}

module.exports = deleteAttachment