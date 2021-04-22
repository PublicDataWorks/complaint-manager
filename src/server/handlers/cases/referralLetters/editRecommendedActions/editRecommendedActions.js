import asyncMiddleware from "../../../asyncMiddleware";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import models from "../../../../policeDataManager/models";

const editRecommendedActions = asyncMiddleware(
  async (request, response, next) => {
    await throwErrorIfLetterFlowUnavailable(request.params.caseId);

    await models.sequelize.transaction(async transaction => {
      if (request.body.letterOfficers) {
        await createOrUpdateReferralLetterOfficerRecommendedActions(
          request.body.letterOfficers,
          request.nickname,
          transaction
        );
      }
      if (request.body.includeRetaliationConcerns !== undefined) {
        const referralLetter = await models.referral_letter.findByPk(
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

    return response.status(200).send();
  }
);

const createOrUpdateReferralLetterOfficerRecommendedActions = async (
  letterOfficers,
  userNickname,
  transaction
) => {
  for (let letterOfficer of letterOfficers) {
    if (!letterOfficer.id) {
      letterOfficer = await models.letter_officer.create(letterOfficer, {
        auditUser: userNickname,
        transaction
      });
    }

    if (letterOfficer.referralLetterOfficerRecommendedActions) {
      const existingRecommendedActions = await getExistingReferralLetterOfficerRecommendedActions(
        letterOfficer.id
      );

      await deleteRemovedReferralOfficerRecommendedActions(
        existingRecommendedActions,
        letterOfficer,
        userNickname,
        transaction
      );

      for (const recommendedAction of letterOfficer.referralLetterOfficerRecommendedActions) {
        if (!existingRecommendedActions.includes(recommendedAction)) {
          await createNewRecommendedAction(
            letterOfficer.id,
            recommendedAction,
            userNickname,
            transaction
          );
        }
      }
    }

    const existingLetterOfficer = await models.letter_officer.findByPk(
      letterOfficer.id,
      { transaction }
    );

    await existingLetterOfficer.update(
      {
        recommendedActionNotes: letterOfficer.recommendedActionNotes
      },
      { auditUser: userNickname, transaction }
    );
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

const deleteRemovedReferralOfficerRecommendedActions = async (
  existingRecommendedActions,
  letterOfficer,
  userNickname,
  transaction
) => {
  if (existingRecommendedActions.length === 0) {
    return;
  }
  const submittedRecommendedActions =
    letterOfficer.referralLetterOfficerRecommendedActions;
  const recommendedActionsToBeDeleted = existingRecommendedActions.filter(
    existingRecommendedAction =>
      !submittedRecommendedActions.includes(existingRecommendedAction)
  );
  await models.referral_letter_officer_recommended_action.destroy({
    where: {
      recommendedActionId: recommendedActionsToBeDeleted,
      referralLetterOfficerId: letterOfficer.id
    },
    auditUser: userNickname,
    transaction
  });
};

const getExistingReferralLetterOfficerRecommendedActions = async referralLetterOfficerId => {
  const officerRecommendedActions = await models.referral_letter_officer_recommended_action.findAll(
    {
      where: { referralLetterOfficerId },
      attributes: ["recommended_action_id"],
      raw: true
    }
  );
  return officerRecommendedActions.map(recommendedAction => {
    return recommendedAction.recommended_action_id;
  });
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
