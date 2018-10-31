import getLetterPreview from "./getLetterPreview";
import httpMocks from "node-mocks-http";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  CASE_STATUS,
  COMPLAINANT,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import Case from "../../../../../client/testUtilities/case";
import Address from "../../../../../client/testUtilities/Address";
import models from "../../../../models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../../client/testUtilities/civilian";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../../../../client/testUtilities/LetterOfficer";
import Allegation from "../../../../../client/testUtilities/Allegation";
import OfficerAllegation from "../../../../../client/testUtilities/OfficerAllegation";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import ReferralLetterOfficerRecommendedAction from "../../../../../client/testUtilities/ReferralLetterOfficerRecommendedAction";
import ReferralLetterIAProCorrection from "../../../../../client/testUtilities/ReferralLetterIAProCorrection";
import ReferralLetterOfficerHistoryNote from "../../../../../client/testUtilities/ReferralLetterOfficerHistoryNote";

describe("getLetterPreview", function() {
  let existingCase, request, response, next, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25");
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "nickname"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns letter address info", async () => {
    await getLetterPreview(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.addresses).toEqual({
      recipient: "recipient address",
      sender: "sender address",
      transcribedBy: "transcriber"
    });
  });

  test("renders civilian info", async () => {
    const civilianComplainantAttributes1 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Bob")
      .withLastName("Smith")
      .withCaseId(existingCase.id);

    const civilianComplainantAttributes2 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Lisa")
      .withLastName("Brown")
      .withCaseId(existingCase.id);

    const civilianComplainant1 = await models.civilian.create(
      civilianComplainantAttributes1,
      { auditUser: "someone" }
    );

    const civilianComplainant2 = await models.civilian.create(
      civilianComplainantAttributes2,
      { auditUser: "someone" }
    );

    const address1Attributes = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("123 Main St")
      .withCity("Chicago")
      .withState("IL")
      .withZipCode("60601")
      .withCountry("USA")
      .withAddressableId(civilianComplainant1.id)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withIntersection(undefined);
    await models.address.create(address1Attributes, { auditUser: "testuser" });

    const address2Attributes = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withIntersection("Canal St & Bourbon St")
      .withCity("Chicago")
      .withState("IL")
      .withZipCode("60661")
      .withCountry("USA")
      .withAddressableId(civilianComplainant2.id)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withStreetAddress(undefined);
    await models.address.create(address2Attributes, { auditUser: "testuser" });

    await getLetterPreview(request, response, next);

    const letterHtml = response._getData().letterHtml;
    expect(letterHtml).toMatch(civilianComplainant1.fullName);
    expect(letterHtml).toMatch(civilianComplainant2.fullName);

    expect(letterHtml).toMatch("123 Main St, Chicago, IL 60601");
    expect(letterHtml).toMatch("Canal St & Bourbon St, Chicago, IL 60661");
  });

  test("it renders officer complainants", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "someone"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Roger")
      .withLastName("Williams")
      .withRoleOnCase(COMPLAINANT);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "someone" }
    );

    await getLetterPreview(request, response, next);

    const letterHtml = response._getData().letterHtml;
    expect(letterHtml).toMatch(caseOfficer.fullName);
  });

  test("it renders the accused officers", async () => {
    const knownOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const knownOfficer = await models.officer.create(knownOfficerAttributes, {
      auditUser: "someone"
    });

    const knownCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(knownOfficer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Sam")
      .withLastName("Smith")
      .withRoleOnCase(ACCUSED);

    const unknownCaseOfficerAttributes = new CaseOfficer.Builder()
      .withUnknownOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRoleOnCase(ACCUSED);

    const knownCaseOfficer = await models.case_officer.create(
      knownCaseOfficerAttributes,
      { auditUser: "someone" }
    );

    const unknownCaseOfficer = await models.case_officer.create(
      unknownCaseOfficerAttributes,
      { auditUser: "someone" }
    );

    const knownLetterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(knownCaseOfficer.id);

    await models.letter_officer.create(knownLetterOfficerAttributes, {
      auditUser: "someone"
    });

    const unknownLetterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(unknownCaseOfficer.id);

    await models.letter_officer.create(unknownLetterOfficerAttributes, {
      auditUser: "someone"
    });

    await getLetterPreview(request, response, next);

    const letterHtml = response._getData().letterHtml;
    expect(letterHtml).toMatch(knownCaseOfficer.fullName);
    expect(letterHtml).toMatch(unknownCaseOfficer.fullName);
  });

  test("it renders the witnesses", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "someone"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Sam")
      .withLastName("Smith")
      .withRoleOnCase(WITNESS);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "someone" }
    );

    const civilianWitnessAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Bob")
      .withLastName("Smith")
      .withCaseId(existingCase.id)
      .withRoleOnCase(WITNESS);

    const civilianWitness = await models.civilian.create(
      civilianWitnessAttributes,
      { auditUser: "someone" }
    );

    await getLetterPreview(request, response, next);

    const letterHtml = response._getData().letterHtml;
    expect(letterHtml).toMatch(caseOfficer.fullName);
    expect(letterHtml).toMatch(civilianWitness.fullName);
  });

  describe("snapshotTests", function() {
    let letterOfficer;

    beforeEach(async () => {
      const civilianComplainantAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withCaseId(existingCase.id)
        .withRoleOnCase(COMPLAINANT)
        .withId(undefined);
      const civilianComplainant = await models.civilian.create(
        civilianComplainantAttributes,
        {
          auditUser: "test"
        }
      );

      const accusedOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(2);
      const accusedOfficer = await models.officer.create(
        accusedOfficerAttributes,
        {
          auditUser: "test"
        }
      );

      const accusedCaseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(accusedOfficer.id)
        .withCaseId(existingCase.id)
        .withRoleOnCase(ACCUSED);
      const accusedCaseOfficer = await models.case_officer.create(
        accusedCaseOfficerAttributes,
        {
          auditUser: "test"
        }
      );

      const allegationAttributes = new Allegation.Builder()
        .defaultAllegation()
        .withId(undefined);

      const allegation = await models.allegation.create(allegationAttributes, {
        auditUser: "test"
      });

      const caseOfficerAllegationAttributes = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation.id)
        .withCaseOfficerId(accusedCaseOfficer.id);

      await models.officer_allegation.create(caseOfficerAllegationAttributes, {
        auditUser: "test"
      });

      const complainantAddressAttributes = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withAddressableId(civilianComplainant.id);

      await models.address.create(complainantAddressAttributes, {
        auditUser: "test"
      });

      const incidentLocationAttributes = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType(ADDRESSABLE_TYPE.CASES)
        .withAddressableId(existingCase.id);

      await models.address.create(incidentLocationAttributes, {
        auditUser: "test"
      });

      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(accusedCaseOfficer.id)
        .withNumHistoricalHighAllegations(1)
        .withNumHistoricalMedAllegations(2)
        .withNumHistoricalLowAllegations(3)
        .withHistoricalBehaviorNotes("This officer has done this before")
        .withRecommendedActionNotes(
          "We recommend this officer is disciplined."
        );

      letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "test" }
      );
    });

    test("renders correctly with minimum required letter data", async () => {
      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("renders correctly with a civilian witness", async () => {
      const civilianWitnessAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withCaseId(existingCase.id)
        .withRoleOnCase(WITNESS)
        .withId(undefined);
      await models.civilian.create(civilianWitnessAttributes, {
        auditUser: "test"
      });

      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("renders correctly with an officer complainant", async () => {
      const officerComplainantAttributes = new Officer.Builder()
        .defaultOfficer()
        .withOfficerNumber(159)
        .withId(undefined);
      const officerComplainant = await models.officer.create(
        officerComplainantAttributes,
        { auditUser: "test" }
      );

      const caseOfficerComplainantAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withOfficerId(officerComplainant.id)
        .withRoleOnCase(COMPLAINANT);
      await models.case_officer.create(caseOfficerComplainantAttributes, {
        auditUser: "test"
      });

      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("renders correctly with recommended action", async () => {
      const recommendedAction = await models.recommended_action.create({
        description: "This is a description of the recommended action"
      });

      const referralLetterOfficerRecommendedActionAttributes = new ReferralLetterOfficerRecommendedAction.Builder()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id)
        .withRecommendedActionId(recommendedAction.id);

      await models.referral_letter_officer_recommended_action.create(
        referralLetterOfficerRecommendedActionAttributes,
        {
          auditUser: "test"
        }
      );

      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("it renders correctly with iapro corrections", async () => {
      const referralLetterIAProCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
        .defaultReferralLetterIAProCorrection()
        .withId(undefined)
        .withReferralLetterId(referralLetter.id);

      await models.referral_letter_iapro_correction.create(
        referralLetterIAProCorrectionAttributes,
        {
          auditUser: "test"
        }
      );

      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("renders correctly with history notes", async () => {
      const referralLetterOfficerHistoryNoteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
        .defaultReferralLetterOfficerHistoryNote()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id);

      await models.referral_letter_officer_history_note.create(
        referralLetterOfficerHistoryNoteAttributes,
        { auditUser: "test" }
      );

      await getLetterPreview(request, response, next);
      expect(response._getData().letterHtml).toMatchSnapshot();
    });

    test("renders correctly with all details", async () => {
      const civilianWitnessAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withCaseId(existingCase.id)
        .withRoleOnCase(WITNESS)
        .withId(undefined);
      await models.civilian.create(civilianWitnessAttributes, {
        auditUser: "test"
      });

      const officerComplainantAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(132);
      const officerComplainant = await models.officer.create(
        officerComplainantAttributes,
        { auditUser: "test" }
      );

      const caseOfficerComplainantAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withOfficerId(officerComplainant.id)
        .withRoleOnCase(COMPLAINANT);
      await models.case_officer.create(caseOfficerComplainantAttributes, {
        auditUser: "test"
      });

      const recommendedAction = await models.recommended_action.create({
        description: "This is a description of the recommended action"
      });

      const referralLetterOfficerRecommendedActionAttributes = new ReferralLetterOfficerRecommendedAction.Builder()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id)
        .withRecommendedActionId(recommendedAction.id);

      await models.referral_letter_officer_recommended_action.create(
        referralLetterOfficerRecommendedActionAttributes,
        {
          auditUser: "test"
        }
      );

      const referralLetterIAProCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
        .defaultReferralLetterIAProCorrection()
        .withId(undefined)
        .withReferralLetterId(referralLetter.id);

      await models.referral_letter_iapro_correction.create(
        referralLetterIAProCorrectionAttributes,
        {
          auditUser: "test"
        }
      );

      const referralLetterOfficerHistoryNoteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
        .defaultReferralLetterOfficerHistoryNote()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id);

      await models.referral_letter_officer_history_note.create(
        referralLetterOfficerHistoryNoteAttributes,
        { auditUser: "test" }
      );
    });
  });
});
