import checkForValidStatus from "../checkForValidStatus";
import models from "../../../../models/index";
import asyncMiddleware from "../../../asyncMiddleware";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

const editIAProCorrections = asyncMiddleware(
  async (request, response, next) => {
    await checkForValidStatus(request.params.caseId);
    const referralLetter = await models.referral_letter.findOne({
      where: { caseId: request.params.caseId }
    });

    await models.sequelize.transaction(async transaction => {
      if (request.body.referralLetterIAProCorrections) {
        await createOrUpdateOrDeleteIAProCorrections(
          request.body.referralLetterIAProCorrections,
          referralLetter.id,
          request.nickname,
          transaction
        );
      }
    });
    return response.status(200).send();
  }
);

const createOrUpdateOrDeleteIAProCorrections = async (
  iaProCorrections,
  referralLetterId,
  userNickname,
  transaction
) => {
  const filteredIAProCorrections = filterBlankIAProCorrections(
    iaProCorrections
  );
  await deleteUnsubmittedExistingIAProCorrections(
    filteredIAProCorrections,
    referralLetterId,
    userNickname,
    transaction
  );
  for (const iaproCorrectionData of filteredIAProCorrections) {
    Object.assign(iaproCorrectionData, { referralLetterId });
    if (iaproCorrectionData.id) {
      await updateExistingIAProCorrection(
        iaproCorrectionData,
        userNickname,
        transaction
      );
    } else {
      await createNewIAProCorrection(
        iaproCorrectionData,
        userNickname,
        transaction
      );
    }
  }
};

const filterBlankIAProCorrections = iaProCorrections => {
  return iaProCorrections.filter(
    correction => correction.details && correction.details.trim() !== ""
  );
};

const deleteUnsubmittedExistingIAProCorrections = async (
  iaProCorrections,
  referralLetterId,
  userNickname,
  transaction
) => {
  const existingIAProCorrections = await getExistingIAProCorrectionIdsForReferralLetter(
    referralLetterId
  );
  if (existingIAProCorrections.length === 0) {
    return;
  }
  const submittedIAProCorrectionIds = iaProCorrections.map(iaProCorrection => {
    return iaProCorrection.id;
  });
  const iaProCorrectionIdsToBeDeleted = existingIAProCorrections.filter(
    existingIAProCorrectionId =>
      !submittedIAProCorrectionIds.includes(existingIAProCorrectionId)
  );
  await models.referral_letter_iapro_correction.destroy({
    where: { id: iaProCorrectionIdsToBeDeleted },
    auditUser: userNickname,
    transaction
  });
};

const getExistingIAProCorrectionIdsForReferralLetter = async referralLetterId => {
  return await models.referral_letter_iapro_correction
    .findAll({
      where: { referralLetterId },
      attributes: ["id"],
      raw: true
    })
    .map(iaProCorrection => {
      return iaProCorrection.id;
    });
};

const createNewIAProCorrection = async (
  iaproCorrectionData,
  userNickname,
  transaction
) => {
  await models.referral_letter_iapro_correction.create(iaproCorrectionData, {
    auditUser: userNickname,
    transaction
  });
};

const updateExistingIAProCorrection = async (
  iaproCorrectionData,
  userNickname,
  transaction
) => {
  const correction = await models.referral_letter_iapro_correction.findById(
    iaproCorrectionData.id
  );
  if (!correction) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_IAPRO_CORRECTION);
  }
  await correction.update(iaproCorrectionData, {
    auditUser: userNickname,
    transaction
  });
};

export default editIAProCorrections;
