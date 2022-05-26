import Busboy from "busboy";
import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models/index";
import isDuplicateFileName from "./isDuplicateFileName";
import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  DUPLICATE_FILE_NAME,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";
import { auditFileAction } from "../../audits/auditFileAction";
import winston from "winston";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const uploadAttachment = asyncMiddleware(async (request, response, next) => {
  let managedUpload;
  const caseId = request.params.caseId;
  const busboy = Busboy({
    headers: request.headers
  });

  let attachmentDescription;

  busboy.on("field", function (fieldname, value) {
    if (fieldname === "description") {
      attachmentDescription = value;
    }
  });

  await busboy.on(
    "file",
    async function (fieldname, file, {filename} ) {
      const s3 = createConfiguredS3Instance();
      if (request.isArchived) {
        response
          .status(400)
          .send(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE);
      } else if (await isDuplicateFileName(caseId, filename)) {
        response.status(409).send(DUPLICATE_FILE_NAME);
      } else {
        managedUpload = s3.upload({
          Bucket: config[process.env.NODE_ENV].s3Bucket,
          Key: `${caseId}/${filename}`,
          Body: file,
          ServerSideEncryption: "AES256"
        });

        //The AWS S3 JS SDK has a non-standard promise implementation.
        //The success function and error functions are passed as arguments to then().
        //This means that we can't use await.
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html
        const promise = managedUpload.promise();
        await promise.then(
          async function (data) {
            const updatedCase = await models.sequelize.transaction(
              async transaction => {
                const attachment = await models.attachment.create(
                  {
                    fileName: filename,
                    description: attachmentDescription,
                    caseId
                  },
                  {
                    transaction,
                    auditUser: request.nickname
                  }
                );
                const caseDetailsAndAuditDetails =
                  await getCaseWithAllAssociationsAndAuditDetails(
                    caseId,
                    transaction,
                    request.permissions
                  );

                const caseDetails = caseDetailsAndAuditDetails.caseDetails;
                const auditDetails = caseDetailsAndAuditDetails.auditDetails;

                await auditFileAction(
                  request.nickname,
                  caseId,
                  AUDIT_ACTION.UPLOADED,
                  filename,
                  AUDIT_FILE_TYPE.ATTACHMENT,
                  transaction
                );
                await auditDataAccess(
                  request.nickname,
                  caseId,
                  MANAGER_TYPE.COMPLAINT,
                  AUDIT_SUBJECT.CASE_DETAILS,
                  auditDetails,
                  transaction
                );

                return caseDetails;
              }
            );

            if (process.env.NODE_ENV === "development") {
              response.setHeader(
                "Access-Control-Allow-Origin",
                "https://localhost"
              );
            }
            response.send(updatedCase);
          },
          function (error) {
            winston.error(error);
            next(Boom.badImplementation(error));
          }
        );
      }
    }
  );

  request.on("close", () => {
    if (managedUpload) managedUpload.abort();
  });

  request.pipe(busboy);
});

export default uploadAttachment;
