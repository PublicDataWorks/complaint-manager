import models from "../../../../models/index";
import asyncMiddleware from "../../../asyncMiddleware";
import checkForValidStatus from "../checkForValidStatus";
import Boom from "boom";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";

const ALLOWED_STATUSES = [
  CASE_STATUS.LETTER_IN_PROGRESS,
  CASE_STATUS.READY_FOR_REVIEW
];

const editReferralLetterContent = asyncMiddleware(
  async (request, response, next) => {
    await checkForValidStatus(request.params.caseId, ALLOWED_STATUSES);

    const referralLetter = await models.referral_letter.findOne({
      where: { caseId: request.params.caseId }
    });

    if (referralLetter == null) {
      throw Boom.badRequest("No referral letter for given case id.");
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
