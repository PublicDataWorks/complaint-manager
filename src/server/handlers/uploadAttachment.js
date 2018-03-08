const Busboy = require('busboy')
const models = require('../models/index')
const AWS = require('aws-sdk')
const path = require('path');
const differentiateFileName = require("./differentiateFileName")

const uploadAttachment = (request, response, next) => {
// Create a Busboy instance passing the HTTP Request headers.
    var busboy = new Busboy({
        headers: request.headers
    })
    let s3, uploadManager, uploadData
    busboy.on('file', async function (fieldname, file, requestedFileName, encoding, mimetype) {
        const s3 = new AWS.S3()

        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            s3.config.loadFromPath(path.join(__dirname, '../awsConfig.json'))
        }

        try {
            let fileNameToSave

            const attachmentsWithSimilarName = await models.attachment.count(
                {
                    where: {
                        caseId: request.params.id,
                        key: {
                            $like: `%${requestedFileName}%`
                        }
                    }
                })

            const differentiator = new Date().getTime().toString()

            if (attachmentsWithSimilarName > 0) {
                fileNameToSave = differentiateFileName(requestedFileName, differentiator)
            } else {
                fileNameToSave = requestedFileName
            }

            const data = await s3.upload({
                Bucket: 'noipm-staging',
                Key: `${request.params.id}/${fileNameToSave}`,
                Body: file
            }, {}).promise()

            const updatedCase = await models.sequelize.transaction(async (t) => {
                await models.attachment.create({
                        key: data.Key,
                        caseId: request.params.id
                    },
                    {
                        transaction: t
                    })

                await models.audit_log.create({
                    caseId: request.params.id,
                    user: 'tuser',
                    action: `Attachment added to Case ${request.params.id}`
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
            response.send(updatedCase)

        } catch (error) {
            console.log("error: ", error)
            console.log('I ded')
            next(error)
        }
    })

    request.pipe(busboy);
}

module.exports = uploadAttachment

