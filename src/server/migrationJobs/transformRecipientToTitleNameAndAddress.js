import models from "../policeDataManager/models";
import _ from "lodash";

export const getTitleAndNameOf = recipientInformation => {
  return recipientInformation
    ? recipientInformation.substring(0, recipientInformation.indexOf("\n"))
    : "";
};

export const getAddressOf = recipientInformation => {
  return recipientInformation
    ? recipientInformation.substring(recipientInformation.indexOf("\n") + 1)
    : "";
};

export const transformRecipientToTitleNameAndAddress = async (
  referralLetters,
  transaction
) => {
  for (let i = 0; i < referralLetters.length; i++) {
    if (
      !referralLetters[i].recipient_address &&
      !_.isEmpty(referralLetters[i])
    ) {
      await updateDatabaseWithCorrectRecipientTitleNameAndAddress(
        referralLetters[i],
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectRecipientTitleNameAndAddress = async (
  referralLetter,
  transaction
) => {
  const updateReferralRecipientQuery = `UPDATE referral_letters SET 
    recipient = '${getTitleAndNameOf(referralLetter.recipient)}', 
    recipient_address = '${getAddressOf(referralLetter.recipient)}'
    WHERE id = ${referralLetter.id}`;

  await models.sequelize.query(updateReferralRecipientQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};

export const revertTitleNameAndAddressToRecipient = async (
  referralLetters,
  transaction
) => {
  for (let i = 0; i < referralLetters.length; i++) {
    if (referralLetters[i].recipient_address) {
      await updateDatabaseWithCorrectRecipient(referralLetters[i], transaction);
    }
  }
};

const updateDatabaseWithCorrectRecipient = async (
  referralLetter,
  transaction
) => {
  const recipientInfo =
    referralLetter.recipient + "\n" + referralLetter.recipient_address;

  const updateReferralRecipientQuery = `UPDATE referral_letters SET 
    recipient = '${recipientInfo}', 
    recipient_address = NULL
    WHERE id = ${referralLetter.id}`;

  await models.sequelize.query(updateReferralRecipientQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};
