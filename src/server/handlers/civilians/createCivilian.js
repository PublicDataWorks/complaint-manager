import {
  ADDRESSABLE_TYPE,
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

    await legacyAuditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(caseId, transaction);
  });

  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
