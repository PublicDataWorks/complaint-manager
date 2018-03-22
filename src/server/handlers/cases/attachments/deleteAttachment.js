const config = require("../../../config/config")
const models = require('../../../models/index')
const createConfiguredS3Instance = require("./createConfiguredS3Instance")

const deleteAttachment = async (request, response, next) => {
    const s3 = createConfiguredS3Instance()

    try {
        const deleteRequest = s3.deleteObject({
            Bucket: config[process.env.NODE_ENV].s3Bucket,
            Key: `${request.params.id}/${request.params.fileName}`,
        })

        await deleteRequest.promise()

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
    } catch (error) {
        next(error)
    }
}

module.exports = deleteAttachment