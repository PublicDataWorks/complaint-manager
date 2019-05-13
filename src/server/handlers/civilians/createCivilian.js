import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
import { getCaseWithAllAssociations } from "../getCaseHelpers";
import legacyAuditDataAccess from "../legacyAuditDataAccess";

const createCivilian = asyncMiddleware(async (req, res) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    let values = req.body;

    if (req.body.address) {
      values.address = {
        ...req.body.address,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN
      };
    }

    const civilianCreated = await models.civilian.create(values, {
      auditUser: req.nickname,
      include: [{ model: models.address, auditUser: req.nickname }],
      transaction
    });

    const caseId = civilianCreated.caseId;

    let auditDetails = {};

    const caseDetails = await getCaseWithAllAssociations(
      caseId,
      transaction,
      auditDetails
    );

    await legacyAuditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return caseDetails;
  });

  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
