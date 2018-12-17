import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../models/index";
import ReferralLetterOfficerHistoryNote from "../../../../../client/testUtilities/ReferralLetterOfficerHistoryNote";
import LetterOfficer from "../../../../../client/testUtilities/LetterOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import getReferralLetterData from "./getReferralLetterData";
import httpMocks from "node-mocks-http";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  COMPLAINANT
} from "../../../../../sharedUtilities/constants";
import ReferralLetterIAProCorrection from "../../../../../client/testUtilities/ReferralLetterIAProCorrection";
import ReferralLetterOfficerRecommendedAction from "../../../../../client/testUtilities/ReferralLetterOfficerRecommendedAction";
import Case from "../../../../../client/testUtilities/case";

jest.mock("shortid", () => ({ generate: () => "uniqueTempId" }));

describe("getReferralLetterData", () => {
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
      nickname: "bobjo"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("audits the data access", async () => {
    await getReferralLetterData(request, response, next);

    const dataAccessAudit = await models.action_audit.find();
    expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(dataAccessAudit.user).toEqual("bobjo");
    expect(dataAccessAudit.caseId).toEqual(existingCase.id);
    expect(dataAccessAudit.subject).toEqual(AUDIT_SUBJECT.REFERRAL_LETTER_DATA);
    expect(dataAccessAudit.subjectDetails).toEqual(["Referral Letter Data"]);
  });

  test("it returns letter data but does not include letter officers that are not accused officers", async () => {
    const complainantOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const complainantOfficer = await models.officer.create(
      complainantOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(complainantOfficer.id)
      .withFirstName("Shelley")
      .withLastName("Complainant")
      .withCaseId(existingCase.id)
      .withRoleOnCase(COMPLAINANT);

    await models.case_officer.create(complainantCaseOfficerAttributes, {
      auditUser: "test"
    });

    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      letterOfficers: [],
      referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  describe("there is a letter officer", function() {
    let letterOfficer, caseOfficer;

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
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withNumHistoricalHighAllegations(2)
        .withNumHistoricalMedAllegations(3)
        .withNumHistoricalLowAllegations(1)
        .withRecommendedActionNotes("some recommendation notes")
        .withHistoricalBehaviorNotes("some historical behavior notes");

      letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "test" }
      );
    });

    test("it returns needed letter data when there are case officers and letter officers, but no notes (adds one empty note)", async () => {
      const expectedResponseBody = {
        id: referralLetter.id,
        caseId: existingCase.id,
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        letterOfficers: [
          {
            id: letterOfficer.id,
            caseOfficerId: caseOfficer.id,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              letterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              letterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              letterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes: letterOfficer.historicalBehaviorNotes,
            referralLetterOfficerHistoryNotes: [emptyObject],
            recommendedActionNotes: letterOfficer.recommendedActionNotes,
            referralLetterOfficerRecommendedActions: []
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };

      await getReferralLetterData(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns needed letter data when there is already a letter and letter officers and notes created", async () => {
      const referralLetterOfficerHistoryNoteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
        .defaultReferralLetterOfficerHistoryNote()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id)
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
        letterOfficers: [
          {
            id: letterOfficer.id,
            caseOfficerId: letterOfficer.caseOfficerId,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              letterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              letterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              letterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes: letterOfficer.historicalBehaviorNotes,
            recommendedActionNotes: letterOfficer.recommendedActionNotes,
            referralLetterOfficerRecommendedActions: [],
            referralLetterOfficerHistoryNotes: [
              {
                id: referralLetterOfficerHistoryNote.id,
                pibCaseNumber: referralLetterOfficerHistoryNote.pibCaseNumber,
                details: referralLetterOfficerHistoryNote.details,
                referralLetterOfficerId: letterOfficer.id
              }
            ]
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };

      await getReferralLetterData(request, response, next);
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
        .withReferralLetterOfficerId(letterOfficer.id)
        .withRecommendedActionId(recommendedAction1.id);

      const referralLetterOfficerRecommendedActionAttributes2 = new ReferralLetterOfficerRecommendedAction.Builder()
        .defaultReferralLetterOfficerRecommendedAction()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id)
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
        letterOfficers: [
          {
            id: letterOfficer.id,
            caseOfficerId: letterOfficer.caseOfficerId,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              letterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              letterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              letterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes: letterOfficer.historicalBehaviorNotes,
            recommendedActionNotes: letterOfficer.recommendedActionNotes,
            referralLetterOfficerHistoryNotes: [emptyObject],
            referralLetterOfficerRecommendedActions: [
              referralLetterOfficerRecommendedAction1.recommendedActionId,
              referralLetterOfficerRecommendedAction2.recommendedActionId
            ]
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };
      await getReferralLetterData(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns letter data when status is after approved", async () => {
      await existingCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );

      await existingCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "test" }
      );

      const expectedResponseBody = {
        id: referralLetter.id,
        caseId: existingCase.id,
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        letterOfficers: [
          {
            id: letterOfficer.id,
            caseOfficerId: letterOfficer.caseOfficerId,
            fullName: caseOfficer.fullName,
            numHistoricalHighAllegations:
              letterOfficer.numHistoricalHighAllegations,
            numHistoricalMedAllegations:
              letterOfficer.numHistoricalMedAllegations,
            numHistoricalLowAllegations:
              letterOfficer.numHistoricalLowAllegations,
            historicalBehaviorNotes: letterOfficer.historicalBehaviorNotes,
            recommendedActionNotes: letterOfficer.recommendedActionNotes,
            referralLetterOfficerHistoryNotes: [emptyObject],
            referralLetterOfficerRecommendedActions: []
          }
        ],
        referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
      };

      await getReferralLetterData(request, response, next);
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
      letterOfficers: [],
      referralLetterIAProCorrections: [
        { id: iaproCorrection.id, details: iaproCorrection.details }
      ]
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  test("returns 3 empty iapro corrections when they do not exist", async () => {
    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      letterOfficers: [],
      referralLetterIAProCorrections: [
        { tempId: "uniqueTempId" },
        { tempId: "uniqueTempId" },
        { tempId: "uniqueTempId" }
      ]
    };

    await getReferralLetterData(request, response, next);
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
      letterOfficers: [
        {
          caseOfficerId: caseOfficer.id,
          fullName: caseOfficer.fullName,
          referralLetterOfficerHistoryNotes: [emptyObject],
          referralLetterOfficerRecommendedActions: []
        }
      ],
      referralLetterIAProCorrections: [emptyObject, emptyObject, emptyObject]
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });
});
