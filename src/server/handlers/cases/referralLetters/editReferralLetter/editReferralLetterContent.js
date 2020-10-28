import models from "../../../../policeDataManager/models/index";
import asyncMiddleware from "../../../asyncMiddleware";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import Boom from "boom";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

const ALLOWED_STATUSES = [
  CASE_STATUS.LETTER_IN_PROGRESS,
  CASE_STATUS.READY_FOR_REVIEW
];

const editReferralLetterContent = asyncMiddleware(
  async (request, response, next) => {
    await throwErrorIfLetterFlowUnavailable(
      request.params.caseId,
      ALLOWED_STATUSES
    );

    const referralLetter = await models.referral_letter.findOne({
      where: { caseId: request.params.caseId }
    });

    if (referralLetter == null) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.REFERRAL_LETTER_DOES_NOT_EXIST);
    }
    await referralLetter.update(
      {
        editedLetterHtml: request.body.editedLetterHtml
      },
      {
        auditUser: request.nickname
      }
    );

    return response.status(200).send({});
  }
);

export default editReferralLetterContent;
