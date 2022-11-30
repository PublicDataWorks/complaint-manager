import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const getLetterTypes = asyncMiddleware(async (request, response, next) => {
  const queryOptions = {
    attributes: [
      "id",
      "type",
      "template",
      "editableTemplate",
      "requiresApproval",
      "hasEditPage"
    ],
    include: [
      {
        model: models.signers,
        as: "defaultSender",
        foreignKey: { field: "default_sender", allowNull: false }
      },
      {
        model: models.caseStatus,
        as: "requiredStatus",
        foreignKey: {
          field: "required_status",
          allowNull: true
        }
      },
      {
        model: models.letterTypeLetterImage,
        as: "letterTypeLetterImage",
        attributes: ["id", "imageId", "letterId", "maxWidth", "name"],
        foreignKey: {
          field: "letterId",
          allowNull: false
        }
      },
      {
        model: models.complaintTypes,
        as: "complaintTypes",
        attributes: ["name"]
      }
    ]
  };
  const letterTypes = await models.letter_types.findAll(queryOptions);

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.LETTER_TYPES,
    getQueryAuditAccessDetails(queryOptions, models.letter_types.type),
    null
  );

  response
    .status(200)
    .send(letterTypes.map(letterType => letterType.toPayload(letterType)));
});

export default getLetterTypes;
