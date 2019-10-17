import shiftSingleElementOfArray from "../../../sharedUtilities/shiftSingleElementOfArray";
import {
  AUDIT_SUBJECT,
  DECLINES_OPTION
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const models = require("../../models");
const _ = require("lodash");

const asyncMiddleware = require("../asyncMiddleware");

const getClassifications = asyncMiddleware(async (request, response, next) => {
  let classificationValues;
  await models.sequelize.transaction(async transaction => {
    const classifications = await getSortedClassificationsAndAuditDetails(
      transaction
    );
    classificationValues = classifications.allClassifications.map(
      classification => {
        return {
          name: classification.name,
          message: classification.message,
          id: classification.id
        };
      }
    );
    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_CLASSIFICATIONS,
      classifications.auditDetails,
      transaction
    );
  });

  response.status(200).send(classificationValues);
});

const getSortedClassificationsAndAuditDetails = async transaction => {
  const queryOptions = { attributes: ["name", "message", "id"], raw: true };
  const allClassifications = await models.new_classifications.findAll(
    queryOptions,
    transaction
  );
  const declineOption = allClassifications.find(
    option => option.name === DECLINES_OPTION
  );
  const finalIndex = allClassifications.length - 1;
  shiftSingleElementOfArray(allClassifications, declineOption, finalIndex);

  const classificationAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.new_classifications.name
  );
  return {
    allClassifications: allClassifications,
    auditDetails: classificationAuditDetails
  };
};

export default getClassifications;
