import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models/index";
import ReferralLetterOfficerHistoryNote from "../../../../../client/testUtilities/ReferralLetterOfficerHistoryNote";
import ReferralLetterOfficer from "../../../../../client/testUtilities/ReferralLetterOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import getReferralLetter from "./getReferralLetter";
import httpMocks from "node-mocks-http";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import ReferralLetterIAProCorrection from "../../../../../client/testUtilities/ReferralLetterIAProCorrection";
import ReferralLetterOfficerRecommendedAction from "../../../../../client/testUtilities/ReferralLetterOfficerRecommendedAction";
jest.mock("shortid", () => ({ generate: () => "uniqueTempId" }));

describe("getReferralLetter", () => {
  let existingCase, referralLetter, request, response, next, emptyObject;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    emptyObject = { tempId: "uniqueTempId" };
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
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

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withIncludeRetaliationConcerns(true)
      .withCaseId(existingCase.id);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
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

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("there is a letter officer", function() {
    let referralLetterOfficer, caseOfficer;

    beforeEach(async () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);

      const officer = await models.officer.create(officerAttributes, {
        auditUser: "test"
      });

      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(officer.id)
        .withFirstName("SpongeBob")
        .withLastName("SquarePants")
        .withCaseId(existingCase.id);

      caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
        auditUser: "test"
      });
      const referralLetterOfficerAttributes = new ReferralLetterOfficer.Builder()
        .defaultReferralLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withnumHistoricalHighAllegations(2)
        .withnumHistoricalMedAllegations(3)
        .withnumHistoricalLowAllegations(1)
        .withRecommendedActionNotes("some recommendation notes")
        .withHistoricalBehaviorNotes("some historical behavior notes");

      referralLetterOfficer = await models.referral_letter_officer.create(
        referralLetterOfficerAttributes,
        { auditUser: "test" }
      );
    });

    test("it returns needed letter data when there are case officers and letter officers, but no notes (adds one empty note)", async () => {
      const expectedResponseBody = {
        id: referralLetter.id,
        caseId: existingCase.id,
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        referralLetterOfficers: [
          {
            id: referralLetterOfficer.id,
            caseOfficerId: caseOfficer.id,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              referralLetterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              referralLetterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              referralLetterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes:
              referralLetterOfficer.historicalBehaviorNotes,
            referralLetterOfficerHistoryNotes: [emptyObject],
            recommendedActionNotes:
              referralLetterOfficer.recommendedActionNotes,
            referralLetterOfficerRecommendedActions: []
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };

      await getReferralLetter(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns needed letter data when there is already a letter and letter officers and notes created", async () => {
      const referralLetterOfficerHistoryNoteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
        .defaultReferralLetterOfficerHistoryNote()
        .withId(undefined)
        .withReferralLetterOfficerId(referralLetterOfficer.id)
        .withPibCaseNumber("#123")
        .withDetails("some officer history note details");

      const referralLetterOfficerHistoryNote = await models.referral_letter_officer_history_note.create(
        referralLetterOfficerHistoryNoteAttributes,
        { auditUser: "test" }
      );

      const expectedResponseBody = {
        id: referralLetter.id,
        caseId: existingCase.id,
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        referralLetterOfficers: [
          {
            id: referralLetterOfficer.id,
            caseOfficerId: referralLetterOfficer.caseOfficerId,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              referralLetterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              referralLetterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              referralLetterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes:
              referralLetterOfficer.historicalBehaviorNotes,
            recommendedActionNotes:
              referralLetterOfficer.recommendedActionNotes,
            referralLetterOfficerRecommendedActions: [],
            referralLetterOfficerHistoryNotes: [
              {
                id: referralLetterOfficerHistoryNote.id,
                pibCaseNumber: referralLetterOfficerHistoryNote.pibCaseNumber,
                details: referralLetterOfficerHistoryNote.details,
                referralLetterOfficerId: referralLetterOfficer.id
              }
            ]
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };

      await getReferralLetter(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns an array of each recommended action id", async () => {
      const description1 = "first action";
      const description2 = "second action";
      const recommendedAction1 = await models.recommended_action.create(
        { description: description1 },
        { auditUser: "someone" }
      );
      const recommendedAction2 = await models.recommended_action.create(
        { description: description2 },
        { auditUser: "someone" }
      );
      const referralLetterOfficerRecommendedActionAttributes1 = new ReferralLetterOfficerRecommendedAction.Builder()
        .defaultReferralLetterOfficerRecommendedAction()
        .withId(undefined)
        .withReferralLetterOfficerId(referralLetterOfficer.id)
        .withRecommendedActionId(recommendedAction1.id);

      const referralLetterOfficerRecommendedActionAttributes2 = new ReferralLetterOfficerRecommendedAction.Builder()
        .defaultReferralLetterOfficerRecommendedAction()
        .withId(undefined)
        .withReferralLetterOfficerId(referralLetterOfficer.id)
        .withRecommendedActionId(recommendedAction2.id);

      const referralLetterOfficerRecommendedAction1 = await models.referral_letter_officer_recommended_action.create(
        referralLetterOfficerRecommendedActionAttributes1,
        { auditUser: "someone" }
      );

      const referralLetterOfficerRecommendedAction2 = await models.referral_letter_officer_recommended_action.create(
        referralLetterOfficerRecommendedActionAttributes2,
        { auditUser: "someone" }
      );

      const expectedResponseBody = {
        id: referralLetter.id,
        caseId: existingCase.id,
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        referralLetterOfficers: [
          {
            id: referralLetterOfficer.id,
            caseOfficerId: referralLetterOfficer.caseOfficerId,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              referralLetterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              referralLetterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              referralLetterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes:
              referralLetterOfficer.historicalBehaviorNotes,
            recommendedActionNotes:
              referralLetterOfficer.recommendedActionNotes,
            referralLetterOfficerHistoryNotes: [emptyObject],
            referralLetterOfficerRecommendedActions: [
              referralLetterOfficerRecommendedAction1.recommendedActionId,
              referralLetterOfficerRecommendedAction2.recommendedActionId
            ]
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };
      await getReferralLetter(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });
  });

  test("returns iapro corrections when they exist", async () => {
    const iaproCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
      .defaultReferralLetterIAProCorrection()
      .withId(undefined)
      .withReferralLetterId(referralLetter.id)
      .withDetails("Stuff was wrong!!!");
    const iaproCorrection = await models.referral_letter_iapro_correction.create(
      iaproCorrectionAttributes,
      { auditUser: "test" }
    );

    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      referralLetterOfficers: [],
      referralLetterIAProCorrections: [
        { id: iaproCorrection.id, details: iaproCorrection.details }
      ]
    };

    await getReferralLetter(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  test("returns 3 empty iapro corrections when they do not exist", async () => {
    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      referralLetterOfficers: [],
      referralLetterIAProCorrections: [
        { tempId: "uniqueTempId" },
        { tempId: "uniqueTempId" },
        { tempId: "uniqueTempId" }
      ]
    };

    await getReferralLetter(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  test("it returns needed letter data when there are case officers but no letter officers yet", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withFirstName("SpongeBob")
      .withLastName("SquarePants")
      .withCaseId(existingCase.id);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      referralLetterOfficers: [
        {
          caseOfficerId: caseOfficer.id,
          fullName: caseOfficer.fullName,
          referralLetterOfficerHistoryNotes: [emptyObject],
          referralLetterOfficerRecommendedActions: []
        }
      ],
      referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
    };

    await getReferralLetter(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });
});
