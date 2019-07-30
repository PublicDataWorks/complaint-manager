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
import mockFflipObject from "../../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../../audits/auditDataAccess";

jest.mock("../../../audits/auditDataAccess");

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
    await models.civilian_title.create({
      name: "Miss",
      id: 2
    });

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
        .withRoleOnCase(COMPLAINANT)
        .withCivilianTitleId(2)
        .withCivilianTitle({
          name: "Miss",
          id: 2
        });
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
        .withCaseId(existingCase.id)
        .withCivilianTitleId(2)
        .withCivilianTitle({
          name: "Miss",
          id: 2
        });

      const civilianComplainantAttributes2 = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName("Lisa")
        .withLastName("Brown")
        .withCaseId(existingCase.id)
        .withCivilianTitleId(2)
        .withCivilianTitle({
          name: "Miss",
          id: 2
        });

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
        .withRoleOnCase(WITNESS)
        .withCivilianTitleId(2)
        .withCivilianTitle({
          name: "Miss",
          id: 2
        });

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
      let letterOfficer, genderIdentity;

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

        genderIdentity = await models.gender_identity.create(
          { name: "Female" },
          { auditUser: "test" }
        );

        const civilianComplainantAttributes = new Civilian.Builder()
          .defaultCivilian()
          .withCaseId(existingCase.id)
          .withRoleOnCase(COMPLAINANT)
          .withGenderIdentityId(genderIdentity.id)
          .withRaceEthnicityId(raceEthnicity.id)
          .withId(undefined)
          .withCivilianTitleId(2)
          .withCivilianTitle({
            name: "Miss",
            id: 2
          });

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
          .withId(undefined)
          .withCivilianTitleId(2)
          .withCivilianTitle({
            name: "Miss",
            id: 2
          });

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
        const referralLetterIaproCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
          .defaultReferralLetterIAProCorrection()
          .withId(undefined)
          .withReferralLetterId(referralLetter.id);

        await models.referral_letter_iapro_correction.create(
          referralLetterIaproCorrectionAttributes,
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
          .withGenderIdentityId(genderIdentity.id)
          .withCaseId(existingCase.id)
          .withRoleOnCase(WITNESS)
          .withId(undefined)
          .withCivilianTitleId(2)
          .withCivilianTitle({
            name: "Miss",
            id: 2
          });

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

        const referralLetterIaproCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
          .defaultReferralLetterIAProCorrection()
          .withId(undefined)
          .withReferralLetterId(referralLetter.id);

        await models.referral_letter_iapro_correction.create(
          referralLetterIaproCorrectionAttributes,
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

    describe("newAuditFeature toggle off", () => {
      beforeEach(() => {
        request.fflip = mockFflipObject({
          newAuditFeature: false
        });
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
        expect(dataAccessAudit.auditDetails).toEqual({
          "Accused Officers": ["All Accused Officers Data"],
          Address: ["All Address Data"],
          Allegation: ["All Allegation Data"],
          Allegations: ["All Allegations Data"],
          Attachment: ["All Attachment Data"],
          Case: [
            "Assigned To",
            "Case Number",
            "Case Reference",
            "Classification Id",
            "Complaint Type",
            "Created At",
            "Created By",
            "District",
            "First Contact Date",
            "How Did You Hear About Us Source Id",
            "Id",
            "Incident Date",
            "Incident Time",
            "Intake Source Id",
            "Is Archived",
            "Narrative Details",
            "Narrative Summary",
            "Next Status",
            "Pdf Available",
            "Pib Case Number",
            "Primary Complainant",
            "Status",
            "Updated At",
            "Year"
          ],
          Classification: ["All Classification Data"],
          "Complainant Civilians": ["All Complainant Civilians Data"],
          "Complainant Officers": ["All Complainant Officers Data"],
          "Gender Identity": ["All Gender Identity Data"],
          "How Did You Hear About Us Source": [
            "All How Did You Hear About Us Source Data"
          ],
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
          "Referral Letter Iapro Corrections": [
            "All Referral Letter Iapro Corrections Data"
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
        expect(dataAccessAudit.auditDetails).toEqual({
          "Accused Officers": ["All Accused Officers Data"],
          Address: ["All Address Data"],
          Allegation: ["All Allegation Data"],
          Allegations: ["All Allegations Data"],
          Attachment: ["All Attachment Data"],
          Case: [
            "Assigned To",
            "Case Number",
            "Case Reference",
            "Classification Id",
            "Complaint Type",
            "Created At",
            "Created By",
            "District",
            "First Contact Date",
            "How Did You Hear About Us Source Id",
            "Id",
            "Incident Date",
            "Incident Time",
            "Intake Source Id",
            "Is Archived",
            "Narrative Details",
            "Narrative Summary",
            "Next Status",
            "Pdf Available",
            "Pib Case Number",
            "Primary Complainant",
            "Status",
            "Updated At",
            "Year"
          ],
          Classification: ["All Classification Data"],
          "Complainant Civilians": ["All Complainant Civilians Data"],
          "Complainant Officers": ["All Complainant Officers Data"],
          "Gender Identity": ["All Gender Identity Data"],
          "How Did You Hear About Us Source": [
            "All How Did You Hear About Us Source Data"
          ],
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
    });

    describe("newAuditFeature toggle on", () => {
      beforeEach(() => {
        request.fflip = mockFflipObject({
          newAuditFeature: true
        });
      });

      test("ensures auditDataAccess is called with correct values", async () => {
        await getReferralLetterPreview(request, response, next);
        const referralLetterPreviewCaseAttributes = [
          "assignedTo",
          "caseNumber",
          "classificationId",
          "complaintType",
          "createdAt",
          "createdBy",
          "district",
          "firstContactDate",
          "howDidYouHearAboutUsSourceId",
          "id",
          "incidentDate",
          "incidentTime",
          "intakeSourceId",
          "isArchived",
          "narrativeDetails",
          "narrativeSummary",
          "pdfAvailable",
          "pibCaseNumber",
          "status",
          "updatedAt",
          "year"
        ];

        const expectedAuditDetails = {
          accusedOfficers: {
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          },
          address: {
            attributes: expect.arrayContaining(
              Object.keys(models.address.rawAttributes)
            ),
            model: models.address.name
          },
          allegation: {
            attributes: expect.arrayContaining(
              Object.keys(models.allegation.rawAttributes)
            ),
            model: models.allegation.name
          },
          allegations: {
            attributes: expect.arrayContaining(
              Object.keys(models.officer_allegation.rawAttributes)
            ),
            model: models.officer_allegation.name
          },
          attachment: {
            attributes: expect.arrayContaining(
              Object.keys(models.attachment.rawAttributes)
            ),
            model: models.attachment.name
          },
          cases: {
            attributes: expect.arrayContaining(
              referralLetterPreviewCaseAttributes
            ),
            model: models.cases.name
          },
          classification: {
            attributes: expect.arrayContaining(
              Object.keys(models.classification.rawAttributes)
            ),
            model: models.classification.name
          },
          complainantCivilians: {
            attributes: expect.arrayContaining(
              Object.keys(models.civilian.rawAttributes)
            ),
            model: models.civilian.name
          },
          complainantOfficers: {
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          },
          genderIdentity: {
            attributes: expect.arrayContaining(
              Object.keys(models.gender_identity.rawAttributes)
            ),
            model: models.gender_identity.name
          },
          incidentLocation: {
            attributes: expect.arrayContaining(
              Object.keys(models.address.rawAttributes)
            ),
            model: models.address.name
          },
          howDidYouHearAboutUsSource: {
            attributes: expect.arrayContaining(
              Object.keys(models.how_did_you_hear_about_us_source.rawAttributes)
            ),
            model: models.how_did_you_hear_about_us_source.name
          },
          intakeSource: {
            attributes: expect.arrayContaining(
              Object.keys(models.intake_source.rawAttributes)
            ),
            model: models.intake_source.name
          },
          letterOfficer: {
            attributes: expect.arrayContaining(
              Object.keys(models.letter_officer.rawAttributes)
            ),
            model: models.letter_officer.name
          },
          raceEthnicity: {
            attributes: expect.arrayContaining(
              Object.keys(models.race_ethnicity.rawAttributes)
            ),
            model: models.race_ethnicity.name
          },
          recommendedAction: {
            attributes: expect.arrayContaining(
              Object.keys(models.recommended_action.rawAttributes)
            ),
            model: models.recommended_action.name
          },
          referralLetter: {
            attributes: expect.arrayContaining([
              ...Object.keys(models.referral_letter.rawAttributes),
              "draftFilename",
              "editStatus",
              "lastEdited"
            ]),
            model: models.referral_letter.name
          },
          referralLetterIaproCorrections: {
            attributes: expect.arrayContaining(
              Object.keys(models.referral_letter_iapro_correction.rawAttributes)
            ),
            model: models.referral_letter_iapro_correction.name
          },
          referralLetterOfficerHistoryNotes: {
            attributes: expect.arrayContaining(
              Object.keys(
                models.referral_letter_officer_history_note.rawAttributes
              )
            ),
            model: models.referral_letter_officer_history_note.name
          },
          referralLetterOfficerRecommendedActions: {
            attributes: expect.arrayContaining(
              Object.keys(
                models.referral_letter_officer_recommended_action.rawAttributes
              )
            ),
            model: models.referral_letter_officer_recommended_action.name
          },
          witnessCivilians: {
            attributes: expect.arrayContaining(
              Object.keys(models.civilian.rawAttributes)
            ),
            model: models.civilian.name
          },
          witnessOfficers: {
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          }
        };

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
          expectedAuditDetails,
          expect.anything()
        );
      });

      test("audits the data if the letter is edited", async () => {
        await referralLetter.update(
          { editedLetterHtml: "<p>something</p>" },
          { auditUser: "nickname" }
        );

        await getReferralLetterPreview(request, response, next);

        const referralLetterPreviewCaseAttributes = [
          "assignedTo",
          "caseNumber",
          "classificationId",
          "complaintType",
          "createdAt",
          "createdBy",
          "district",
          "firstContactDate",
          "howDidYouHearAboutUsSourceId",
          "id",
          "incidentDate",
          "incidentTime",
          "intakeSourceId",
          "isArchived",
          "narrativeDetails",
          "narrativeSummary",
          "pdfAvailable",
          "pibCaseNumber",
          "status",
          "updatedAt",
          "year"
        ];

        const expectedAuditDetails = {
          accusedOfficers: {
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          },
          address: {
            attributes: expect.arrayContaining(
              Object.keys(models.address.rawAttributes)
            ),
            model: models.address.name
          },
          allegation: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.allegation.rawAttributes)
            ),
            model: models.allegation.name
          }),
          allegations: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.officer_allegation.rawAttributes)
            ),
            model: models.officer_allegation.name
          }),
          attachment: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.attachment.rawAttributes)
            ),
            model: models.attachment.name
          }),
          cases: expect.objectContaining({
            attributes: expect.arrayContaining(
              referralLetterPreviewCaseAttributes
            ),
            model: models.cases.name
          }),
          classification: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.classification.rawAttributes)
            ),
            model: models.classification.name
          }),
          complainantCivilians: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.civilian.rawAttributes)
            ),
            model: models.civilian.name
          }),
          complainantOfficers: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          }),
          genderIdentity: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.gender_identity.rawAttributes)
            ),
            model: models.gender_identity.name
          }),
          howDidYouHearAboutUsSource: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.how_did_you_hear_about_us_source.rawAttributes)
            ),
            model: models.how_did_you_hear_about_us_source.name
          }),
          incidentLocation: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.address.rawAttributes)
            ),
            model: models.address.name
          }),
          intakeSource: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.intake_source.rawAttributes)
            ),
            model: models.intake_source.name
          }),
          raceEthnicity: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.race_ethnicity.rawAttributes)
            ),
            model: models.race_ethnicity.name
          }),
          referralLetter: expect.objectContaining({
            attributes: expect.arrayContaining([
              ...Object.keys(models.referral_letter.rawAttributes),
              "draftFilename",
              "editStatus",
              "lastEdited"
            ]),
            model: models.referral_letter.name
          }),
          witnessCivilians: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.civilian.rawAttributes)
            ),
            model: models.civilian.name
          }),
          witnessOfficers: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.case_officer.rawAttributes)
            ),
            model: models.case_officer.name
          })
        };

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
          expectedAuditDetails,
          expect.anything()
        );
      });
    });
  });
});
