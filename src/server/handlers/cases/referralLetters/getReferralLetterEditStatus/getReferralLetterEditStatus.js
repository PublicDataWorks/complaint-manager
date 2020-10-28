import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../policeDataManager/models";

import {
  AUDIT_SUBJECT,
  EDIT_STATUS,
  MANAGER_TYPE
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../audits/auditDataAccess";
import _ from "lodash";

const getReferralLetterEditStatus = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;

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

      const auditDetails = {
        [_.camelCase(models.referral_letter.name)]: {
          attributes: ["editStatus"],
          model: models.referral_letter.name
        }
      };

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
        auditDetails,
        transaction
      );

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
