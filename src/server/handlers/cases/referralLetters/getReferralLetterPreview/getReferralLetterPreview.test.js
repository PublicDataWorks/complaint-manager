import getReferralLetterPreview from "./getReferralLetterPreview";
import httpMocks from "node-mocks-http";
import fs from "fs";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  EDIT_STATUS,
  MANAGER_TYPE,
  REFERRAL_LETTER_VERSION,
  USER_PERMISSIONS,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import Case from "../../../../../sharedTestHelpers/case";
import Address from "../../../../../sharedTestHelpers/Address";
import models from "../../../../policeDataManager/models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import LetterOfficer from "../../../../testHelpers/LetterOfficer";
import Allegation from "../../../../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../../../../sharedTestHelpers/OfficerAllegation";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import ReferralLetterOfficerRecommendedAction from "../../../../testHelpers/ReferralLetterOfficerRecommendedAction";
import ReferralLetterOfficerHistoryNote from "../../../../testHelpers/ReferralLetterOfficerHistoryNote";
import constructFilename from "../constructFilename";
import RaceEthnicity from "../../../../../sharedTestHelpers/raceEthnicity";
import auditDataAccess from "../../../audits/auditDataAccess";
import ReferralLetterCaseClassification from "../../../../../sharedTestHelpers/ReferralLetterCaseClassification";
import Signer from "../../../../../sharedTestHelpers/signer";

jest.mock("../../../audits/auditDataAccess");

describe("getReferralLetterPreview", function () {
  let existingCase, request, response, next, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    const signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      { auditUser: "user" }
    );

    const letterBodyTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
    );
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withEditableTemplate(letterBodyTemplate.toString())
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .build(),
      { auditUser: "test" }
    );

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
      nickname: "bobjo",
      permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient title and name")
      .withRecipientAddress("recipient address")
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
        recipient: "recipient title and name",
        recipientAddress: "recipient address",
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

    describe("snapshotTests", function () {
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

      test("renders correctly with case number", async () => {
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

        const referralLetterOfficerRecommendedActionAttributes =
          new ReferralLetterOfficerRecommendedAction.Builder()
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

      test("renders correctly with history notes", async () => {
        const referralLetterOfficerHistoryNoteAttributes =
          new ReferralLetterOfficerHistoryNote.Builder()
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
        const newClassification = await models.classification.create({
          id: 1,
          name: "Cereal Misconduct",
          message: "Wasteful"
        });

        const caseClassificationAttributes =
          new ReferralLetterCaseClassification.Builder()
            .defaultReferralLetterCaseClassification()
            .withCaseId(existingCase.id)
            .withClassificationId(newClassification.id);
        await models.case_classification.create(caseClassificationAttributes, {
          auditUser: "test"
        });

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

        const referralLetterOfficerRecommendedActionAttributes =
          new ReferralLetterOfficerRecommendedAction.Builder()
            .withId(undefined)
            .withReferralLetterOfficerId(letterOfficer.id)
            .withRecommendedActionId(recommendedAction.id);

        await models.referral_letter_officer_recommended_action.create(
          referralLetterOfficerRecommendedActionAttributes,
          {
            auditUser: "test"
          }
        );

        const referralLetterOfficerHistoryNoteAttributes =
          new ReferralLetterOfficerHistoryNote.Builder()
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

    describe("auditing", () => {
      test("ensures auditDataAccess is called with correct values", async () => {
        await getReferralLetterPreview(request, response, next);
        const referralLetterPreviewCaseAttributes = [
          "assignedTo",
          "caseNumber",
          "complaintType",
          "createdAt",
          "createdBy",
          "districtId",
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
          caseClassifications: {
            attributes: expect.toIncludeSameMembers(
              Object.keys(models.case_classification.rawAttributes)
            ),
            model: models.case_classification.name
          },
          classification: {
            attributes: expect.toIncludeSameMembers(
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
          caseDistrict: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.district.rawAttributes)
            ),
            model: models.district.name
          }),
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
          MANAGER_TYPE.COMPLAINT,
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
          "complaintType",
          "createdAt",
          "createdBy",
          "districtId",
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
          caseClassifications: {
            attributes: expect.toIncludeSameMembers(
              Object.keys(models.case_classification.rawAttributes)
            ),
            model: models.case_classification.name
          },
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
          caseDistrict: expect.objectContaining({
            attributes: expect.arrayContaining(
              Object.keys(models.district.rawAttributes)
            ),
            model: models.district.name
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
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
          expectedAuditDetails,
          expect.anything()
        );
      });
    });
  });
});
