import asyncMiddleware from "../../../asyncMiddleware";
import checkForValidStatus from "../checkForValidStatus";
import models from "../../../../models";
import getLetterDataForResponse from "../getLetterDataForResponse";

const editRecommendedActions = asyncMiddleware(
  async (request, response, next) => {
    await checkForValidStatus(request.params.caseId);

    await models.sequelize.transaction(async transaction => {
      if (request.body.referralLetterOfficers) {
        await createOrUpdateReferralLetterOfficerRecommendedActions(
          request.body.referralLetterOfficers,
          request.nickname,
          transaction
        );
      }
      if (request.body.includeRetaliationConcerns) {
        const referralLetter = await models.referral_letter.findById(
          request.body.id
        );
        await updateIncludeRetaliationConcerns(
          referralLetter,
          request.body.includeRetaliationConcerns,
          request.nickname,
          transaction
        );
      }
    });
    const letterDataForResponse = await getLetterDataForResponse(
      request.params.caseId
    );
    return response.status(200).send(letterDataForResponse);
  }
);

const createOrUpdateReferralLetterOfficerRecommendedActions = async (
  referralLetterOfficers,
  userNickname,
  transaction
) => {
  for (const referralLetterOfficer of referralLetterOfficers) {
    if (referralLetterOfficer.referralLetterOfficerRecommendedActions) {
      for (const recommendedAction of referralLetterOfficer.referralLetterOfficerRecommendedActions) {
        await createNewRecommendedAction(
          referralLetterOfficer.id,
          recommendedAction,
          userNickname,
          transaction
        );
      }
    }
    if (referralLetterOfficer.recommendedActionNotes) {
      const existingReferralLetterOfficer = await models.referral_letter_officer.findById(
        referralLetterOfficer.id
      );
      await existingReferralLetterOfficer.update(
        {
          recommendedActionNotes: referralLetterOfficer.recommendedActionNotes
        },
        { auditUser: userNickname, transaction }
      );
    }
  }
};

const createNewRecommendedAction = async (
  referralLetterOfficerId,
  recommendedAction,
  userNickname,
  transaction
) => {
  await models.referral_letter_officer_recommended_action.create(
    { referralLetterOfficerId, recommendedActionId: recommendedAction },
    { auditUser: userNickname, transaction }
  );
};

const updateIncludeRetaliationConcerns = async (
  referralLetter,
  includeRetaliationConcerns,
  userNickname,
  transaction
) => {
  await referralLetter.update(
    { includeRetaliationConcerns },
    { auditUser: userNickname, transaction }
  );
};

export default editRecommendedActions;
