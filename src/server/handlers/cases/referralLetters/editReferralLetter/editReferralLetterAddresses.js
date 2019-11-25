import models from "../../../../complaintManager/models/index";
import asyncMiddleware from "../../../asyncMiddleware";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";

const editReferralLetterAddresses = asyncMiddleware(
  async (request, response, next) => {
    await throwErrorIfLetterFlowUnavailable(request.params.caseId);

    const referralLetter = await models.referral_letter.findOne({
      where: { caseId: request.params.caseId }
    });

    await referralLetter.update(
      {
        recipient: request.body.recipient,
        sender: request.body.sender,
        transcribedBy: request.body.transcribedBy
      },
      { auditUser: request.nickname }
    );

    return response.status(200).send({});
  }
);

export default editReferralLetterAddresses;
