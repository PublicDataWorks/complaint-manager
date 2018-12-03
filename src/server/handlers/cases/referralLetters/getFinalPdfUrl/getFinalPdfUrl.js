import asyncMiddleware from "../../../asyncMiddleware";
import auditDataAccess from "../../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import config from "../../../../config/config";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import Boom from "boom";
import moment from "moment";

const getFinalPdfUrl = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const existingCase = await models.cases.findById(caseId, {
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
    ]
  });

  validateCaseStatus(existingCase.status);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );
    const signedUrl = getSignedS3Url(existingCase);
    response.send(signedUrl);
  });
});

const getSignedS3Url = existingCase => {
  const s3 = createConfiguredS3Instance();

  const formattedFirstContactDate = moment(
    existingCase.firstContactDate
  ).format("MM-DD-YYYY");

  const formattedLastName = determineLastName(existingCase);
  const keyLastName = formattedLastName ? `_${formattedLastName}` : "";

  return s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    Key: `${existingCase.id}/${formattedFirstContactDate}_${
      existingCase.caseNumber
    }_PIB_Referral${keyLastName}.pdf`,
    Expires: S3_URL_EXPIRATION
  });
};

const determineLastName = existingCase => {
  const complainant =
    existingCase.complaintType === CIVILIAN_INITIATED
      ? existingCase.complainantCivilians[0]
      : existingCase.complainantOfficers[0];
  const complainantLastName = complainant ? complainant.lastName : "";
  return complainantLastName
    ? complainantLastName.replace(/[^a-zA-Z]/g, "")
    : "";
};

const validateCaseStatus = caseStatus => {
  if (
    caseStatus !== CASE_STATUS.FORWARDED_TO_AGENCY &&
    caseStatus !== CASE_STATUS.CLOSED
  ) {
    throw Boom.badRequest("Invalid case status");
  }
};

export default getFinalPdfUrl;
