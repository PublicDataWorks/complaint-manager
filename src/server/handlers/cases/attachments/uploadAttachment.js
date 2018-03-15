const Busboy = require('busboy')
const models = require('../../../models/index')
const isDuplicateFileName = require("./isDuplicateFileName")
const createConfiguredS3Instance = require("./createConfiguredS3Instance")
const config = require("../../../config/config")
const DUPLICATE_FILE_NAME = require("../../../../sharedUtilities/constants").DUPLICATE_FILE_NAME

const uploadAttachment = (request, response, next) => {
    let managedUpload
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
                managedUpload = s3.upload({
                    Bucket: config[process.env.NODE_ENV].s3Bucket,
                    Key: `${caseId}/${fileName}`,
                    Body: file
                })

                const data = await managedUpload.promise()

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

                    await models.cases.update(
                        {status: 'Active'},
                        {
                            where: {id: caseId},
                            transaction: t
                        }
                    )

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

    request.on('close', () => {
        managedUpload.abort()
    })

    request.pipe(busboy);
}

module.exports = uploadAttachment

