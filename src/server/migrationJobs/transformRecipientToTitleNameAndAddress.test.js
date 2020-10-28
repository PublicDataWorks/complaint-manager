import models from "../policeDataManager/models";
import ReferralLetter from "../testHelpers/ReferralLetter";
import Case from "../../sharedTestHelpers/case";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import {
  transformRecipientToTitleNameAndAddress,
  revertTitleNameAndAddressToRecipient,
  getTitleAndNameOf,
  getAddressOf
} from "./transformRecipientToTitleNameAndAddress";

describe("transforming recipient into title/name and address fields", () => {
  let existingCase,
    referralLetters,
    referralLetterWithRecipientAddress,
    referralLetterWithoutRecipientAddress;

  const selectReferralLettersQuery = "SELECT * FROM referral_letters;";

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);

    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    const referralLetterAttributesForSomeone = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient(
        "recipient title and name\nrecipient address\nrecipient address"
      )
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    const referralLetterAttributesForSomeoneElse = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient title and name")
      .withRecipientAddress("recipient address\nrecipient address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    referralLetterWithoutRecipientAddress = await models.referral_letter.create(
      referralLetterAttributesForSomeone,
      { auditUser: "someone" }
    );

    referralLetterWithRecipientAddress = await models.referral_letter.create(
      referralLetterAttributesForSomeoneElse,
      { auditUser: "someone else" }
    );

    referralLetters = await models.sequelize.query(selectReferralLettersQuery, {
      type: models.sequelize.QueryTypes.SELECT
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return only the first line of text input", async () => {
    expect(
      getTitleAndNameOf(referralLetterWithoutRecipientAddress.recipient)
    ).toEqual("recipient title and name");
  });

  test("should return everything except the first line of text input", async () => {
    expect(
      getAddressOf(referralLetterWithoutRecipientAddress.recipient)
    ).toEqual("recipient address\nrecipient address");
  });

  test("should return updated recipient and recipient address field values", async () => {
    await models.sequelize.transaction(async transaction => {
      await transformRecipientToTitleNameAndAddress(
        referralLetters,
        transaction
      );
    });

    const transformedReferralLettersResults = await models.sequelize.query(
      selectReferralLettersQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedReferralLettersResults[0].recipient).toEqual(
      "recipient title and name"
    );
    expect(transformedReferralLettersResults[0].recipient_address).toEqual(
      "recipient address\nrecipient address"
    );

    expect(transformedReferralLettersResults[1].recipient).toEqual(
      "recipient title and name"
    );
    expect(transformedReferralLettersResults[1].recipient_address).toEqual(
      "recipient address\nrecipient address"
    );
  });

  test("should return reverted recipient and recipient address field values", async () => {
    await models.sequelize.transaction(async transaction => {
      await revertTitleNameAndAddressToRecipient(referralLetters, transaction);
    });

    const transformedReferralLettersResults = await models.sequelize.query(
      selectReferralLettersQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );
    expect(transformedReferralLettersResults[0].recipient).toEqual(
      "recipient title and name\nrecipient address\nrecipient address"
    );
    expect(transformedReferralLettersResults[0].recipient_address).toEqual(
      null
    );

    expect(transformedReferralLettersResults[1].recipient).toEqual(
      "recipient title and name\nrecipient address\nrecipient address"
    );
    expect(transformedReferralLettersResults[1].recipient_address).toEqual(
      null
    );
  });
});
