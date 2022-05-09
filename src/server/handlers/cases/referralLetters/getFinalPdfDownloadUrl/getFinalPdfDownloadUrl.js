import asyncMiddleware from "../../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  CASE_STATUS,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../../sharedUtilities/constants";
import models from "../../../../policeDataManager/models";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { auditFileAction } from "../../../audits/auditFileAction";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const getFinalPdfDownloadUrl = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const existingCase = await models.cases.findByPk(caseId, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      paranoid: false
    });

    validateCaseStatus(existingCase.status);

    const referralLetter = await models.referral_letter.findOne({
      where: { caseId: existingCase.id }
    });

    await models.sequelize.transaction(async transaction => {
      await auditFileAction(
        request.nickname,
        caseId,
        AUDIT_ACTION.DOWNLOADED,
        referralLetter.finalPdfFilename,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        transaction
      );
      let signedUrl = await getSignedS3Url(
        existingCase.id,
        referralLetter.finalPdfFilename
      );

      if (process.env.REACT_APP_USE_CLOUD_SERVICES == "false") {
        signedUrl = signedUrl.replace("host.docker.internal", "localhost");
      }
      response.send(signedUrl);
    });
  }
);

const getSignedS3Url = async (existingCaseId, filename) => {
  const s3 = createConfiguredS3Instance();

  const filenameWithCaseId = `${existingCaseId}/${filename}`;

  return s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    Key: filenameWithCaseId,
    Expires: S3_URL_EXPIRATION
  });
};

const validateCaseStatus = caseStatus => {
  if (
    caseStatus !== CASE_STATUS.FORWARDED_TO_AGENCY &&
    caseStatus !== CASE_STATUS.CLOSED
  ) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
  }
};

export default getFinalPdfDownloadUrl;
