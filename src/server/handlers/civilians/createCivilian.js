import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import legacyAuditDataAccess from "../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import auditDataAccess from "../audits/auditDataAccess";

const createCivilian = asyncMiddleware(async (request, response, next) => {
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );
  const caseDetails = await models.sequelize.transaction(async transaction => {
    let values = request.body;

    if (request.body.address) {
      values.address = {
        ...request.body.address,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN
      };
    }

    const civilianCreated = await models.civilian.create(values, {
      auditUser: request.nickname,
      include: [{ model: models.address, auditUser: request.nickname }],
      transaction
    });

    const caseId = civilianCreated.caseId;

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseDetails;
  });

  response.status(201).send(caseDetails);
});

module.exports = createCivilian;
