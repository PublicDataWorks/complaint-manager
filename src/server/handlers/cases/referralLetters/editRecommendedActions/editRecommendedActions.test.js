import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import httpMocks from "node-mocks-http";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../../../../client/testUtilities/LetterOfficer";
import editRecommendedActions from "./editRecommendedActions";
import ReferralLetterOfficerRecommendedAction from "../../../../../client/testUtilities/ReferralLetterOfficerRecommendedAction";

describe("editRecommendedActions", function() {
  const recommendedActionId1 = 1;
  const recommendedActionId2 = 2;
  const recommendedActionId3 = 3;

  afterEach(async () => {
    await cleanupDatabase();
  });

  let existingCase, referralLetter, response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

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
      .withCaseId(existingCase.id)
      .withIncludeRetaliationConcerns(undefined);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );
  });

  test("saves new includeRetaliationConcerns", async () => {
    const includeRetaliationConcerns = true;
    const requestBody = {
      id: referralLetter.id,
      includeRetaliationConcerns: includeRetaliationConcerns,
      letterOfficers: []
    };
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      body: requestBody,
      nickname: "nickname"
    });
    await editRecommendedActions(request, response, next);
    expect(response.statusCode).toEqual(200);
    await referralLetter.reload();

    expect(referralLetter.includeRetaliationConcerns).toEqual(
      includeRetaliationConcerns
    );
  });

  describe("there is an officer", function() {
    let letterOfficer;

    beforeEach(async () => {
      await models.recommended_action.create(
        { id: recommendedActionId1, description: "action 1" },
        { auditUser: "test" }
      );
      await models.recommended_action.create(
        { id: recommendedActionId2, description: "action 2" },
        { auditUser: "test" }
      );
      await models.recommended_action.create(
        { id: recommendedActionId3, description: "action 3" },
        { auditUser: "test" }
      );

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
        .withCaseId(existingCase.id);

      const caseOfficer = await models.case_officer.create(
        caseOfficerAttributes,
        { auditUser: "someone" }
      );

      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withRecommendedActionNotes(undefined);

      letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "someone" }
      );
    });

    test("saves new recommended actions when one officer", async () => {
      const requestBody = {
        letterOfficers: [
          {
            id: letterOfficer.id,
            referralLetterOfficerRecommendedActions: [
              recommendedActionId1,
              recommendedActionId2
            ]
          }
        ]
      };
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        body: requestBody,
        nickname: "nickname"
      });
      await editRecommendedActions(request, response, next);
      expect(response.statusCode).toEqual(200);

      const createdRecommendedActions = await models.referral_letter_officer_recommended_action.findAll(
        { where: { referralLetterOfficerId: letterOfficer.id } }
      );

      expect(createdRecommendedActions.length).toEqual(2);
      expect(createdRecommendedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recommendedActionId: recommendedActionId1,
            referralLetterOfficerId: letterOfficer.id
          }),
          expect.objectContaining({
            recommendedActionId: recommendedActionId2,
            referralLetterOfficerId: letterOfficer.id
          })
        ])
      );
    });

    test("saves new recommendedActionNotes", async () => {
      const recommendedActionNotes = "some notes";
      const requestBody = {
        id: referralLetter.id,
        letterOfficers: [{ id: letterOfficer.id, recommendedActionNotes }]
      };
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        body: requestBody,
        nickname: "nickname"
      });
      await editRecommendedActions(request, response, next);
      expect(response.statusCode).toEqual(200);
      await letterOfficer.reload();
      expect(letterOfficer.recommendedActionNotes).toEqual(
        recommendedActionNotes
      );
    });

    describe("existing referral letter officer recommended actions", function() {
      let recommendedAction, recommendedAction1;
      beforeEach(async () => {
        const recommendedActionAttributes = new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(letterOfficer.id)
          .withRecommendedActionId(recommendedActionId1);

        recommendedAction = await models.referral_letter_officer_recommended_action.create(
          recommendedActionAttributes,
          { auditUser: "test" }
        );
        const recommendedActionAttributes2 = new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(letterOfficer.id)
          .withRecommendedActionId(recommendedActionId2);

        recommendedAction1 = await models.referral_letter_officer_recommended_action.create(
          recommendedActionAttributes2,
          { auditUser: "test" }
        );
      });

      test("removes existing referral letter officer recommended action", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              referralLetterOfficerRecommendedActions: [
                recommendedActionId1,
                recommendedActionId3
              ]
            }
          ]
        };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editRecommendedActions(request, response, next);
        expect(response.statusCode).toEqual(200);

        const createdRecommendedActions = await models.referral_letter_officer_recommended_action.findAll(
          { where: { referralLetterOfficerId: letterOfficer.id } }
        );

        expect(createdRecommendedActions.length).toEqual(2);

        expect(createdRecommendedActions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              recommendedActionId: recommendedActionId1,
              referralLetterOfficerId: letterOfficer.id
            })
          ])
        );
        expect(createdRecommendedActions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              recommendedActionId: recommendedActionId3,
              referralLetterOfficerId: letterOfficer.id
            })
          ])
        );
      });
    });
  });
});
