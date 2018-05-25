const Busboy = require("busboy");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const isDuplicateFileName = require("./isDuplicateFileName");
const createConfiguredS3Instance = require("./createConfiguredS3Instance");
const config = require("../../../config/config");
const DUPLICATE_FILE_NAME = require("../../../../sharedUtilities/constants")
  .DUPLICATE_FILE_NAME;
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const uploadAttachment = asyncMiddleware((request, response) => {
  let managedUpload;
  const caseId = request.params.id;
  const busboy = new Busboy({
    headers: request.headers
  });

  let attachmentDescription;

  busboy.on("field", function(fieldname, value) {
    if (fieldname === "description") {
      attachmentDescription = value;
    }
  });

  busboy.on("file", async function(
    fieldname,
    file,
    fileName,
    encoding,
    mimetype
  ) {
    const s3 = createConfiguredS3Instance();

    if (await isDuplicateFileName(caseId, fileName)) {
      response.status(409).send(DUPLICATE_FILE_NAME);
    } else {
      managedUpload = s3.upload({
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${caseId}/${fileName}`,
        Body: file
      });

      const data = await managedUpload.promise();

      const updatedCase = await models.sequelize.transaction(async t => {
        await models.attachment.create(
          {
            fileName: fileName,
            description: attachmentDescription,
            caseId: caseId
          },
          {
            transaction: t
          }
        );

        await models.cases.update(
          { status: "Active" },
          {
            where: { id: caseId },
            transaction: t,
            auditUser: request.nickname
          }
        );

        return await getCaseWithAllAssociations(caseId, t);
      });

      response.send(updatedCase);
    }
  });

  request.on("close", () => {
    managedUpload.abort();
  });

  request.pipe(busboy);
});

module.exports = uploadAttachment;
