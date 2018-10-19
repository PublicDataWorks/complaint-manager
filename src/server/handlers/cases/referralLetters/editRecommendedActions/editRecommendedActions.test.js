import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import httpMocks from "node-mocks-http";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import ReferralLetterOfficer from "../../../../../client/testUtilities/ReferralLetterOfficer";
import editRecommendedActions from "./editRecommendedActions";
import ReferralLetterOfficerRecommendedAction from "../../../../../client/testUtilities/ReferralLetterOfficerRecommendedAction";

describe("editRecommendedActions", function() {
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
      referralLetterOfficers: []
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
    let referralLetterOfficer;

    beforeEach(async () => {
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

      const referralLetterOfficerAttributes = new ReferralLetterOfficer.Builder()
        .defaultReferralLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withRecommendedActionNotes(undefined);

      referralLetterOfficer = await models.referral_letter_officer.create(
        referralLetterOfficerAttributes,
        { auditUser: "someone" }
      );
    });

    test("saves new recommended actions when one officer", async () => {
      const recommendedActionId1 = 1;
      const recommendedActionId2 = 2;
      const requestBody = {
        referralLetterOfficers: [
          {
            id: referralLetterOfficer.id,
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
        { where: { referralLetterOfficerId: referralLetterOfficer.id } }
      );

      expect(createdRecommendedActions.length).toEqual(2);
      expect(createdRecommendedActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recommendedActionId: recommendedActionId1,
            referralLetterOfficerId: referralLetterOfficer.id
          }),
          expect.objectContaining({
            recommendedActionId: recommendedActionId2,
            referralLetterOfficerId: referralLetterOfficer.id
          })
        ])
      );
    });

    test("saves new recommendedActionNotes", async () => {
      const recommendedActionNotes = "some notes";
      const requestBody = {
        id: referralLetter.id,
        referralLetterOfficers: [
          { id: referralLetterOfficer.id, recommendedActionNotes }
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
      await referralLetterOfficer.reload();
      expect(referralLetterOfficer.recommendedActionNotes).toEqual(
        recommendedActionNotes
      );
    });

    describe("existing referral letter officer recommended actions", function() {
      let recommendedAction, recommendedAction1;
      beforeEach(async () => {
        const recommendedActionAttributes = new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(referralLetterOfficer.id)
          .withRecommendedActionId(1);
        recommendedAction = await models.referral_letter_officer_recommended_action.create(
          recommendedActionAttributes,
          { auditUser: "test" }
        );
        const recommendedActionAttributes2 = new ReferralLetterOfficerRecommendedAction.Builder()
          .defaultReferralLetterOfficerRecommendedAction()
          .withId(undefined)
          .withReferralLetterOfficerId(referralLetterOfficer.id)
          .withRecommendedActionId(2);
        recommendedAction1 = await models.referral_letter_officer_recommended_action.create(
          recommendedActionAttributes2,
          { auditUser: "test" }
        );
      });

      test("removes existing referral letter officer recommended action", async () => {
        const requestBody = {
          referralLetterOfficers: [
            {
              id: referralLetterOfficer.id,
              referralLetterOfficerRecommendedActions: [
                recommendedAction1.recommendedActionId
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
          { where: { referralLetterOfficerId: referralLetterOfficer.id } }
        );

        expect(createdRecommendedActions.length).toEqual(1);
        expect(createdRecommendedActions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              recommendedActionId: recommendedAction1.recommendedActionId,
              referralLetterOfficerId: referralLetterOfficer.id
            })
          ])
        );
      });
    });
  });
});
