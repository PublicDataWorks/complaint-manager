import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import { sendNotifsIfComplainantChange } from "../sendNotifsIfComplainantChange";
import { updateCaseToActiveIfInitial } from "../cases/helpers/caseStatusHelpers";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../policeDataManager/models");

const createCivilian = asyncMiddleware(async (request, response, next) => {
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
    await updateCaseToActiveIfInitial(caseId, request.nickname, transaction);

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        caseId,
        transaction,
        request.permissions
      );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );
    return caseDetails;
  });

  response.status(201).send(await caseDetails.toJSON());

  await sendNotifsIfComplainantChange(caseDetails.id);
});

module.exports = createCivilian;
