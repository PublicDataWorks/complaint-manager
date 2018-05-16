const config = require("../../../config/config");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const createConfiguredS3Instance = require("./createConfiguredS3Instance");

const deleteAttachment = async (request, response, next) => {
  const s3 = createConfiguredS3Instance();

  try {
    const deleteRequest = s3.deleteObject({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `${request.params.id}/${request.params.fileName}`
    });

    await deleteRequest.promise();

    const caseDetails = await models.sequelize.transaction(async t => {
      await models.attachment.destroy({
        where: {
          fileName: request.params.fileName,
          caseId: request.params.id
        },
        transaction: t
      });

      await models.audit_log.create(
        {
          caseId: request.params.id,
          user: request.nickname,
          action: `Attachment removed`
        },
        {
          transaction: t
        }
      );

      return await getCaseWithAllAssociations(request.params.id, t);
    });
    response.status(200).send(caseDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = deleteAttachment;
