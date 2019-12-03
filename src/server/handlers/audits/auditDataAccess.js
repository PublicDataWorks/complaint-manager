import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import _ from "lodash";
import complaintModels from "../../complaintManager/models";
import matrixModels from "../../matrixManager/models";

const models = _.assign(complaintModels, matrixModels);

const auditDataAccess = async (
  auditUser,
  caseId,
  managerType,
  auditSubject,
  auditDetails,
  transaction
) => {
  const auditValues = {
    auditAction: AUDIT_ACTION.DATA_ACCESSED,
    user: auditUser,
    referenceId: caseId,
    managerType: managerType,
    dataAccessAudit: {
      auditSubject: auditSubject,
      dataAccessValues: transformAuditDetails(auditDetails)
    }
  };
  await models.audit.create(auditValues, {
    include: [
      {
        model: models.data_access_audit,
        as: "dataAccessAudit",
        include: [
          {
            model: models.data_access_value,
            as: "dataAccessValues"
          }
        ]
      }
    ],
    transaction
  });
};

const transformAuditDetails = auditDetails => {
  return Object.keys(auditDetails).map(association => ({
    association: _.camelCase(association),
    fields: auditDetails[association].attributes.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    })
  }));
};

export default auditDataAccess;
