import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import legacyAuditDataAccess from "../../../legacyAuditDataAccess";

import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  EDIT_STATUS
} from "../../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../../auditDataAccess";
import _ from "lodash";

const getReferralLetterEditStatus = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const editStatus = await models.sequelize.transaction(async transaction => {
      const referralLetter = await models.referral_letter.findOne({
        where: { caseId },
        attributes: ["editedLetterHtml"],
        transaction
      });

      let editStatus = { editStatus: null };
      if (referralLetter) {
        editStatus.editStatus = editStatusFromHtml(
          referralLetter.editedLetterHtml
        );
      }

      if (newAuditFeatureToggle) {
        const auditDetails = {
          [_.camelCase(models.referral_letter.name)]: {
            attributes: ["editStatus"],
            model: models.referral_letter.name
          }
        };

        await auditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
          auditDetails,
          transaction
        );
      } else {
        const auditDetails = {
          [models.referral_letter.name]: { attributes: ["editStatus"] }
        };

        await legacyAuditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

      return editStatus;
    });

    response.status(200).send(editStatus);
  }
);

export const editStatusFromHtml = editedLetterHtml => {
  if (editedLetterHtml != null) {
    return EDIT_STATUS.EDITED;
  }
  return EDIT_STATUS.GENERATED;
};

export default getReferralLetterEditStatus;
