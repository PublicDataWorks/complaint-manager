import Busboy from "busboy";
import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../models/index";
import isDuplicateFileName from "./isDuplicateFileName";
import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import config from "../../../config/config";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  DUPLICATE_FILE_NAME
} from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";
import { auditFileAction } from "../../audits/auditFileAction";

const uploadAttachment = asyncMiddleware(async (request, response, next) => {
  let managedUpload;
  const caseId = request.params.caseId;
  const busboy = new Busboy({
    headers: request.headers
  });

  let attachmentDescription;

  busboy.on("field", function(fieldname, value) {
    if (fieldname === "description") {
      attachmentDescription = value;
    }
  });

  await busboy.on("file", async function(
    fieldname,
    file,
    fileName,
    encoding,
    mimetype
  ) {
    const s3 = createConfiguredS3Instance();

    if (request.isArchived) {
      response.status(400).send(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE);
    } else if (await isDuplicateFileName(caseId, fileName)) {
      response.status(409).send(DUPLICATE_FILE_NAME);
    } else {
      managedUpload = s3.upload({
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${caseId}/${fileName}`,

        Body: file,
        ServerSideEncryption: "AES256"
      });

      //The AWS S3 JS SDK has a non-standard promise implementation.
      //The success function and error functions are passed as arguments to then().
      //This means that we can't use await.
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html
      const promise = managedUpload.promise();
      await promise.then(
        async function(data) {
          const updatedCase = await models.sequelize.transaction(
            async transaction => {
              const attachment = await models.attachment.create(
                {
                  fileName: fileName,
                  description: attachmentDescription,
                  caseId: caseId
                },
                {
                  transaction: transaction,
                  auditUser: request.nickname
                }
              );
              const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
                caseId,
                transaction
              );

              const caseDetails = caseDetailsAndAuditDetails.caseDetails;
              const auditDetails = caseDetailsAndAuditDetails.auditDetails;

              await auditFileAction(
                request.nickname,
                caseId,
                AUDIT_ACTION.UPLOADED,
                fileName,
                AUDIT_FILE_TYPE.ATTACHMENT,
                transaction
              );
              await auditDataAccess(
                request.nickname,
                caseId,
                AUDIT_SUBJECT.CASE_DETAILS,
                auditDetails,
                transaction
              );

              return caseDetails;
            }
          );
          response.send(updatedCase);
        },
        function(error) {
          console.error(error);
          next(Boom.badImplementation(error));
        }
      );
    }
  });

  request.on("close", () => {
    managedUpload.abort();
  });

  request.pipe(busboy);
});

export default uploadAttachment;
