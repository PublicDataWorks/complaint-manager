import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../policeDataManager/models/index";
import ReferralLetterOfficerHistoryNote from "../../../../testHelpers/ReferralLetterOfficerHistoryNote";
import LetterOfficer from "../../../../testHelpers/LetterOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import getReferralLetterData from "./getReferralLetterData";
import httpMocks from "node-mocks-http";
import {
  AUDIT_SUBJECT,
  COMPLAINANT,
  MANAGER_TYPE
} from "../../../../../sharedUtilities/constants";
import ReferralLetterOfficerRecommendedAction from "../../../../testHelpers/ReferralLetterOfficerRecommendedAction";
import Case from "../../../../../sharedTestHelpers/case";
import auditDataAccess from "../../../audits/auditDataAccess";
import ReferralLetterCaseClassification from "../../../../../sharedTestHelpers/ReferralLetterCaseClassification";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

jest.mock("nanoid", () => ({ nanoid: () => "uniqueTempId" }));
jest.mock("../../../audits/auditDataAccess");

describe("getReferralLetterData", () => {
  let existingCase,
    referralLetter,
    request,
    response,
    next,
    emptyObject,
    statuses;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    emptyObject = { tempId: "uniqueTempId" };

    statuses = await seedStandardCaseStatuses();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    await existingCase.update(
      {
        currentStatusId: statuses.find(
          status => status.name === "Letter in Progress"
        ).id
      },
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
      classifications: {}
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  describe("there is a letter officer", function () {
    let letterOfficer, caseOfficer, officerHistoryOption;

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

      officerHistoryOption = await models.officer_history_option.create(
        { name: "No noteworthy history" },
        { auditUser: "test" }
      );

      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withNumHistoricalHighAllegations(2)
        .withNumHistoricalMedAllegations(3)
        .withNumHistoricalLowAllegations(1)
        .withRecommendedActionNotes("some recommendation notes")
        .withHistoricalBehaviorNotes("some historical behavior notes")
        .withOfficerHistoryOptionId(officerHistoryOption.id);

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
            officerHistoryOptionId: officerHistoryOption.id.toString(),
            referralLetterOfficerHistoryNotes: [emptyObject],
            recommendedActionNotes: letterOfficer.recommendedActionNotes,
            referralLetterOfficerRecommendedActions: []
          }
        ],
        classifications: {}
      };

      await getReferralLetterData(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns needed letter data when there is already a letter and letter officers and notes created", async () => {
      const referralLetterOfficerHistoryNoteAttributes =
        new ReferralLetterOfficerHistoryNote.Builder()
          .defaultReferralLetterOfficerHistoryNote()
          .withId(undefined)
          .withReferralLetterOfficerId(letterOfficer.id)
          .withPibCaseNumber("#123")
          .withDetails("some officer history note details");

      const referralLetterOfficerHistoryNote =
        await models.referral_letter_officer_history_note.create(
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
            officerHistoryOptionId: officerHistoryOption.id.toString(),
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
        classifications: {}
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
      const referralLetterOfficerRecommendedActionAttributes1 =
        new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(letterOfficer.id)
          .withRecommendedActionId(recommendedAction1.id);

      const referralLetterOfficerRecommendedActionAttributes2 =
        new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(letterOfficer.id)
          .withRecommendedActionId(recommendedAction2.id);

      const referralLetterOfficerRecommendedAction1 =
        await models.referral_letter_officer_recommended_action.create(
          referralLetterOfficerRecommendedActionAttributes1,
          { auditUser: "someone" }
        );

      const referralLetterOfficerRecommendedAction2 =
        await models.referral_letter_officer_recommended_action.create(
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
            officerHistoryOptionId: officerHistoryOption.id.toString(),
            referralLetterOfficerRecommendedActions: [
              referralLetterOfficerRecommendedAction1.recommendedActionId,
              referralLetterOfficerRecommendedAction2.recommendedActionId
            ]
          }
        ],
        classifications: {}
      };
      await getReferralLetterData(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });

    test("it returns letter data when status is after approved", async () => {
      await existingCase.update(
        {
          currentStatusId: statuses.find(
            status => status.name === "Forwarded to Agency"
          ).id
        },
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
            officerHistoryOptionId: officerHistoryOption.id.toString(),
            referralLetterOfficerHistoryNotes: [emptyObject],
            referralLetterOfficerRecommendedActions: []
          }
        ],
        classifications: {}
      };

      await getReferralLetterData(request, response, next);
      expect(response._getData()).toEqual(expectedResponseBody);
    });
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
      classifications: {}
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  test("returns classification data when it exists", async () => {
    const classification = await models.classification.create(
      {
        id: 1,
        name: "Weird",
        message: "Jacob is immature"
      },
      { auditUser: "Wanchenlearn" }
    );
    const caseClassificationAttributes =
      new ReferralLetterCaseClassification.Builder()
        .defaultReferralLetterCaseClassification()
        .withCaseId(existingCase.id)
        .withClassificationId(classification.id);
    await models.case_classification.create(caseClassificationAttributes, {
      auditUser: "test"
    });
    const expectedResponseBody = {
      id: referralLetter.id,
      caseId: existingCase.id,
      includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
      letterOfficers: [],
      classifications: {
        "csfn-1": true
      }
    };

    await getReferralLetterData(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  describe("auditing", () => {
    test("audits the data access", async () => {
      await getReferralLetterData(request, response, next);

      const expectedAuditDetails = {
        caseOfficers: {
          attributes: expect.arrayContaining([
            "firstName",
            "id",
            "lastName",
            "middleName"
          ]),
          model: models.case_officer.name
        },
        letterOfficer: {
          attributes: expect.arrayContaining([
            "caseOfficerId",
            "historicalBehaviorNotes",
            "id",
            "numHistoricalHighAllegations",
            "numHistoricalLowAllegations",
            "numHistoricalMedAllegations",
            "officerHistoryOptionId",
            "recommendedActionNotes"
          ]),
          model: models.letter_officer.name
        },
        referralLetter: {
          attributes: expect.arrayContaining([
            "caseId",
            "id",
            "includeRetaliationConcerns"
          ]),
          model: models.referral_letter.name
        },
        referralLetterOfficerHistoryNotes: {
          attributes: expect.arrayContaining([
            "id",
            "details",
            "pibCaseNumber",
            "referralLetterOfficerId"
          ]),
          model: models.referral_letter_officer_history_note.name
        },
        referralLetterOfficerRecommendedActions: {
          attributes: expect.arrayContaining([
            "recommendedActionId",
            "referralLetterOfficerId"
          ]),
          model: models.referral_letter_officer_recommended_action.name
        },
        caseClassification: {
          attributes: expect.arrayContaining([
            "id",
            "caseId",
            "classificationId"
          ]),
          model: models.case_classification.name
        }
      };

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
        expectedAuditDetails,
        expect.anything()
      );
    });
  });
});
