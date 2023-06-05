import { ACCUSED, CASE_STATUS } from "../../sharedUtilities/constants";
import models from "../../server/policeDataManager/models";
import { updateCaseStatus } from "../../server/handlers/data/queries/queryHelperFunctions";
import ReferralLetter from "../../server/testHelpers/ReferralLetter";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import ReferralLetterCaseClassification from "../../sharedTestHelpers/ReferralLetterCaseClassification";
import LetterOfficer from "../../server/testHelpers/LetterOfficer";
import Allegation from "../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../sharedTestHelpers/OfficerAllegation";

export const setupLetter = async (letterCase, statuses) => {
  try {
    await updateCaseStatus(letterCase, CASE_STATUS.READY_FOR_REVIEW, statuses);

    const letter = await models.referral_letter.create(
      new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(1)
        .withCaseId(letterCase.id)
        .withRecipient("King of all police")
        .withRecipientAddress("100 Main Street, North Pole")
        .withSender("The aggrieved party"),
      { auditUser: "user" }
    );
    return letter;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addOfficerHistoryToReferralLetter = async letter => {
  const caseOfficer = await addAccusedToCase(letter.caseId, true);
  const officerHistory = await models.officer_history_option.create(
    { name: "yes" },
    { auditUser: "user" }
  );

  const letterOfficer = await models.letter_officer.create(
    new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(1)
      .withCaseOfficerId(caseOfficer.id)
      .withOfficerHistoryOptionId(officerHistory.id),
    { auditUser: "user" }
  );
  return letterOfficer;
};

export const addClassificationsToCase = async theCase => {
  const classification = await models.classification.create(
    { id: 1, name: "spongebob", message: "i'm ready" },
    { auditUser: "user" }
  );

  await models.case_classification.create(
    new ReferralLetterCaseClassification.Builder()
      .defaultReferralLetterCaseClassification()
      .withCaseId(theCase.id)
      .withClassificationId(1),
    { auditUser: "user" }
  );
};

export const addAccusedToCase = async (caseId, withAllegation) => {
  const officer = await models.officer.create(
    new Officer.Builder().defaultOfficer().withId(1).withOfficerNumber(27),
    { auditUser: "user" }
  );

  const caseOfficer = await models.case_officer.create(
    new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(1)
      .withOfficerId(officer.id)
      .withCaseId(caseId)
      .withRoleOnCase(ACCUSED)
      .withPersonTypeKey("OFFICER"),
    { auditUser: "user" }
  );

  if (withAllegation) {
    const allegation = await models.allegation.create(
      new Allegation.Builder().defaultAllegation().build(),
      { auditUser: "user" }
    );

    const officerAllegation = await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withAllegationId(allegation.id)
        .withCaseOfficerId(caseOfficer.id)
        .withId(1)
        .build(),
      { auditUser: "user" }
    );
  }

  return caseOfficer;
};
