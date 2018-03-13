const Busboy = require('busboy')
const models = require('../../../models/index')
const isDuplicateFileName = require("./isDuplicateFileName")
const createConfiguredS3Instance = require("./createConfiguredS3Instance")
const config = require("../../../config/config")
const DUPLICATE_FILE_NAME = require("../../../../sharedUtilities/constants").DUPLICATE_FILE_NAME

const uploadAttachment = (request, response, next) => {
    const caseId = request.params.id
    const busboy = new Busboy({
        headers: request.headers
    })

    busboy.on('file', async function (fieldname, file, fileName, encoding, mimetype) {
        const s3 = createConfiguredS3Instance()

        try {
            if (await isDuplicateFileName(caseId, fileName)) {

                response.status(409).send(DUPLICATE_FILE_NAME)

            } else {

                const data = await s3.upload({
                    Bucket: config[process.env.NODE_ENV].s3Bucket,
                    Key: `${caseId}/${fileName}`,
                    Body: file
                }, {}).promise()

                const updatedCase = await models.sequelize.transaction(async (t) => {
                    await models.attachment.create({
                            fileName: fileName,
                            caseId: caseId
                        },
                        {
                            transaction: t
                        })

                    await models.audit_log.create({
                        caseId: caseId,
                        user: 'tuser',
                        action: `Attachment added to Case ${caseId}`
                    })

                    return await models.cases.findById(caseId,
                        {
                            include: [
                                {model: models.civilian},
                                {model: models.attachment}
                            ],
                            transaction: t
                        })

                })
                response.send(updatedCase)
            }

        } catch (error) {
            next(error)
        }
    })

    request.pipe(busboy);
}

module.exports = uploadAttachment

