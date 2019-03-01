import getReferralLetterPreview from "./getReferralLetterPreview";
import httpMocks from "node-mocks-http";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  EDIT_STATUS,
  REFERRAL_LETTER_VERSION,
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
import Classification from "../../../../../client/testUtilities/classification";
import constructFilename from "../constructFilename";
import RaceEthnicity from "../../../../../client/testUtilities/raceEthnicity";

describe("getReferralLetterPreview", function() {
  let existingCase, request, response, next, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([]);
    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "bobjo"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true)
      .withEditedLetterHtml(null);

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should get 400 if in wrong status", async () => {
    await getReferralLetterPreview(request, response, next);
  });

  describe("in letter in progress status", () => {
    beforeEach(async () => {
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
    });

    test("audits the data access if letter is generated", async () => {
      await getReferralLetterPreview(request, response, next);

      const dataAccessAudit = await models.action_audit.findOne();
      expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
      expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
      expect(dataAccessAudit.user).toEqual("bobjo");
      expect(dataAccessAudit.caseId).toEqual(existingCase.id);
      expect(dataAccessAudit.subject).toEqual(
        AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW
      );
      expect(dataAccessAudit.subjectDetails).toEqual({
        "Accused Officers": ["All Accused Officers Data"],
        Address: ["All Address Data"],
        Allegation: ["All Allegation Data"],
        Allegations: ["All Allegations Data"],
        Attachment: ["All Attachment Data"],
        Case: [
          "Assigned To",
          "Case Id",
          "Case Number",
          "Classification Id",
          "Complaint Type",
          "Created At",
          "Created By",
          "District",
          "First Contact Date",
          "Id",
          "Incident Date",
          "Incident Time",
          "Intake Source Id",
          "Is Archived",
          "Narrative Details",
          "Narrative Summary",
          "Pdf Available",
          "Pib Case Number",
          "Status",
          "Updated At",
          "Year"
        ],
        Classification: ["All Classification Data"],
        "Complainant Civilians": ["All Complainant Civilians Data"],
        "Complainant Officers": ["All Complainant Officers Data"],
        "Incident Location": ["All Incident Location Data"],
        "Intake Source": ["All Intake Source Data"],
        "Letter Officer": ["All Letter Officer Data"],
        "Race Ethnicity": ["All Race Ethnicity Data"],
        "Recommended Action": ["All Recommended Action Data"],
        "Referral Letter": [
          "All Referral Letter Data",
          "Draft Filename",
          "Edit Status",
          "Last Edited"
        ],
        "Referral Letter IA Pro Corrections": [
          "All Referral Letter IA Pro Corrections Data"
        ],
        "Referral Letter Officer History Notes": [
          "All Referral Letter Officer History Notes Data"
        ],
        "Referral Letter Officer Recommended Actions": [
          "All Referral Letter Officer Recommended Actions Data"
        ],
        "Witness Civilians": ["All Witness Civilians Data"],
        "Witness Officers": ["All Witness Officers Data"]
      });
    });

    test("audits the data if the letter is edited", async () => {
      await referralLetter.update(
        { editedLetterHtml: "<p>something</p>" },
        { auditUser: "nickname" }
      );

      await getReferralLetterPreview(request, response, next);

      const dataAccessAudit = await models.action_audit.findOne();
      expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
      expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
      expect(dataAccessAudit.user).toEqual("bobjo");
      expect(dataAccessAudit.caseId).toEqual(existingCase.id);
      expect(dataAccessAudit.subject).toEqual(
        AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW
      );
      expect(dataAccessAudit.subjectDetails).toEqual({
        "Accused Officers": ["All Accused Officers Data"],
        Address: ["All Address Data"],
        Allegation: ["All Allegation Data"],
        Allegations: ["All Allegations Data"],
        Attachment: ["All Attachment Data"],
        Case: [
          "Assigned To",
          "Case Number",
          "Classification Id",
          "Complaint Type",
          "Created At",
          "Created By",
          "District",
          "First Contact Date",
          "Id",
          "Incident Date",
          "Incident Time",
          "Intake Source Id",
          "Is Archived",
          "Narrative Details",
          "Narrative Summary",
          "Pdf Available",
          "Pib Case Number",
          "Status",
          "Updated At",
          "Year"
        ],
        Classification: ["All Classification Data"],
        "Complainant Civilians": ["All Complainant Civilians Data"],
        "Complainant Officers": ["All Complainant Officers Data"],
        "Incident Location": ["All Incident Location Data"],
        "Intake Source": ["All Intake Source Data"],
        "Race Ethnicity": ["All Race Ethnicity Data"],
        "Referral Letter": [
          "All Referral Letter Data",
          "Draft Filename",
          "Edit Status",
          "Last Edited"
        ],
        "Witness Civilians": ["All Witness Civilians Data"],
        "Witness Officers": ["All Witness Officers Data"]
      });
    });

    test("returns letter address info", async () => {
      await getReferralLetterPreview(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.addresses).toEqual({
        recipient: "recipient address",
        sender: "sender address",
        transcribedBy: "transcriber"
      });
    });

    test("returns case data so we can populate modal for status transition", async () => {
      await getReferralLetterPreview(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.caseDetails).toEqual(
        expect.objectContaining({
          id: existingCase.id,
          status: CASE_STATUS.LETTER_IN_PROGRESS
        })
      );
    });

    test("it returns the correct final and draft filenames", async () => {
      const complainantCivilianAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withRoleOnCase(COMPLAINANT);
      await models.civilian.create(complainantCivilianAttributes, {
        auditUser: "test"
      });

      await existingCase.reload({
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test"
          }
        ]
      });

      const finalFilename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const draftFilename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.GENERATED
      );
      await getReferralLetterPreview(request, response, next);
      const responseBody = response._getData();
      expect(responseBody).toEqual(
        expect.objectContaining({
          finalFilename: finalFilename,
          draftFilename: draftFilename
        })
      );
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
        .withStreetAddress2("")
        .withCity("Chicago")
        .withState("IL")
        .withZipCode("60601")
        .withCountry("USA")
        .withAddressableId(civilianComplainant1.id)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withIntersection(undefined);
      await models.address.create(address1Attributes, {
        auditUser: "testuser"
      });

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
      await models.address.create(address2Attributes, {
        auditUser: "testuser"
      });

      await getReferralLetterPreview(request, response, next);

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

      await getReferralLetterPreview(request, response, next);

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

      const officerHistoryOption = await models.officer_history_option.create(
        {
          id: 1,
          name: "No noteworthy history"
        },
        { auditUser: "audit user" }
      );

      const knownLetterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(knownCaseOfficer.id)
        .withOfficerHistoryOptionId(officerHistoryOption.id);

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

      await getReferralLetterPreview(request, response, next);

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

      await getReferralLetterPreview(request, response, next);

      const letterHtml = response._getData().letterHtml;
      expect(letterHtml).toMatch(caseOfficer.fullName);
      expect(letterHtml).toMatch(civilianWitness.fullName);
    });

    test("return empty letter when letter type is generated", async () => {
      await referralLetter.update(
        { editedLetterHtml: null },
        { auditUser: "someone" }
      );

      await getReferralLetterPreview(request, response, next);

      const responseData = response._getData();
      expect(responseData.editStatus).toEqual(EDIT_STATUS.GENERATED);
      expect(responseData.lastEdited).toBeTruthy();
    });

    test("return saved letter content when editedLetterHtml is not null", async () => {
      const editedLetterHtml = "<p> letter html content</p>";
      await referralLetter.update(
        { editedLetterHtml: editedLetterHtml },
        { auditUser: "someone" }
      );

      await getReferralLetterPreview(request, response, next);

      const responseData = response._getData();
      expect(responseData.letterHtml).toEqual(editedLetterHtml);
      expect(responseData.editStatus).toEqual(EDIT_STATUS.EDITED);
      expect(responseData.lastEdited).toBeTruthy();
    });

    describe("snapshotTests", function() {
      let letterOfficer;

      beforeEach(async () => {
        const raceEthnicityAttributes = new RaceEthnicity.Builder()
          .defaultRaceEthnicity()
          .withId(undefined);

        const raceEthnicity = await models.race_ethnicity.create(
          raceEthnicityAttributes,
          {
            auditUser: "test"
          }
        );

        const civilianComplainantAttributes = new Civilian.Builder()
          .defaultCivilian()
          .withCaseId(existingCase.id)
          .withRoleOnCase(COMPLAINANT)
          .withRaceEthnicityId(raceEthnicity.id)
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

        const allegation = await models.allegation.create(
          allegationAttributes,
          {
            auditUser: "test"
          }
        );

        const caseOfficerAllegationAttributes = new OfficerAllegation.Builder()
          .defaultOfficerAllegation()
          .withId(undefined)
          .withAllegationId(allegation.id)
          .withCaseOfficerId(accusedCaseOfficer.id);

        await models.officer_allegation.create(
          caseOfficerAllegationAttributes,
          {
            auditUser: "test"
          }
        );

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
        await getReferralLetterPreview(request, response, next);
        expect(response._getData().letterHtml).toMatchSnapshot();
      });

      test("renders correctly with pib case number", async () => {
        await existingCase.update(
          { pibCaseNumber: "2019-0023-R" },
          { auditUser: "test" }
        );
        await getReferralLetterPreview(request, response, next);
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

        await getReferralLetterPreview(request, response, next);
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

        await getReferralLetterPreview(request, response, next);
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

        await getReferralLetterPreview(request, response, next);
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

        await getReferralLetterPreview(request, response, next);
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

        await getReferralLetterPreview(request, response, next);
        expect(response._getData().letterHtml).toMatchSnapshot();
      });

      test("renders correctly with all details", async () => {
        const classificationBwcAttributes = new Classification.Builder()
          .defaultClassification()
          .withId(undefined)
          .withName("Body Worn Camera")
          .withInitialism("BWC");
        const classificationBWC = await models.classification.create(
          classificationBwcAttributes,
          { auditUser: "someone" }
        );
        await existingCase.update(
          { classificationId: classificationBWC.id },
          { auditUser: "someone" }
        );
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

        const officerHistoryOption = await models.officer_history_option.create(
          {
            id: 1,
            name: "No noteworthy history"
          },
          { auditUser: "audit user" }
        );

        await letterOfficer.update(
          { officerHistoryOptionId: officerHistoryOption.id },
          { auditUser: "someone" }
        );

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

        await getReferralLetterPreview(request, response, next);
        expect(response._getData().letterHtml).toMatchSnapshot();
      });
    });
  });
});
