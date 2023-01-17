import models from "../../../../policeDataManager/models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import httpMocks from "node-mocks-http";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import LetterOfficer from "../../../../testHelpers/LetterOfficer";
import editRecommendedActions from "./editRecommendedActions";
import ReferralLetterOfficerRecommendedAction from "../../../../testHelpers/ReferralLetterOfficerRecommendedAction";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

describe("editRecommendedActions", function () {
  const recommendedActionId1 = 1;
  const recommendedActionId2 = 2;
  const recommendedActionId3 = 3;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let existingCase, referralLetter, response, next, statuses;

  beforeEach(async () => {
    await cleanupDatabase();
    response = httpMocks.createResponse();
    next = jest.fn();

    statuses = await seedStandardCaseStatuses();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { statusId: statuses.find(status => status.name === "Active").id },
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

  test("invalid case status returns 400", async () => {
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

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
    );
  });

  describe("letter in progress", () => {
    beforeEach(async () => {
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Letter in Progress"
          ).id
        },
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

    describe("there is an officer but not a letter officer", () => {
      let caseOfficer;

      beforeEach(async () => {
        await models.recommended_action.create(
          { id: recommendedActionId1, description: "action 1" },
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

        caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
          auditUser: "someone"
        });
      });

      test("the letter officer gets created if there is a case officer but no letter officer", async () => {
        const recommendedActionNotes = "letter officer does not exist";

        let requestBody = {
          id: referralLetter.id,
          letterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              recommendedActionNotes: recommendedActionNotes
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

        let letterOfficer = await models.letter_officer.findOne({
          where: {
            caseOfficerId: caseOfficer.id
          }
        });

        expect(letterOfficer.recommendedActionNotes).toEqual(
          recommendedActionNotes
        );
      });
    });

    describe("there is an officer", function () {
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

        const createdRecommendedActions =
          await models.referral_letter_officer_recommended_action.findAll({
            where: { referralLetterOfficerId: letterOfficer.id }
          });

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

      describe("existing referral letter officer recommended actions", function () {
        let recommendedAction, recommendedAction1;
        beforeEach(async () => {
          const recommendedActionAttributes =
            new ReferralLetterOfficerRecommendedAction.Builder()
              .defaultReferralLetterOfficerRecommendedAction()
              .withId(undefined)
              .withReferralLetterOfficerId(letterOfficer.id)
              .withRecommendedActionId(recommendedActionId1);

          recommendedAction =
            await models.referral_letter_officer_recommended_action.create(
              recommendedActionAttributes,
              { auditUser: "test" }
            );
          const recommendedActionAttributes2 =
            new ReferralLetterOfficerRecommendedAction.Builder()
              .defaultReferralLetterOfficerRecommendedAction()
              .withId(undefined)
              .withReferralLetterOfficerId(letterOfficer.id)
              .withRecommendedActionId(recommendedActionId2);

          recommendedAction1 =
            await models.referral_letter_officer_recommended_action.create(
              recommendedActionAttributes2,
              { auditUser: "test" }
            );
        });

        test("removes existing referral letter officer recommended action for only the correct letter officer", async () => {
          const otherOfficerAttributes = new Officer.Builder()
            .defaultOfficer()
            .withOfficerNumber(1)
            .withId(1);

          const otherOfficer = await models.officer.create(
            otherOfficerAttributes,
            {
              auditUser: "someone"
            }
          );

          const otherCaseOfficerAttributes = new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(undefined)
            .withOfficerId(otherOfficer.id)
            .withCaseId(existingCase.id);

          const otherCaseOfficer = await models.case_officer.create(
            otherCaseOfficerAttributes,
            { auditUser: "someone" }
          );

          const otherLetterOfficerAttributes = new LetterOfficer.Builder()
            .defaultLetterOfficer()
            .withId(undefined)
            .withCaseOfficerId(otherCaseOfficer.id)
            .withRecommendedActionNotes(undefined);

          const otherLetterOfficer = await models.letter_officer.create(
            otherLetterOfficerAttributes,
            { auditUser: "someone" }
          );

          const requestBody = {
            letterOfficers: [
              {
                id: otherLetterOfficer.id,
                referralLetterOfficerRecommendedActions: [recommendedActionId1]
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

          const secondRequestBody = {
            letterOfficers: [
              {
                id: letterOfficer.id,
                referralLetterOfficerRecommendedActions: [recommendedActionId1]
              }
            ]
          };

          const secondRequest = httpMocks.createRequest({
            method: "PUT",
            headers: {
              authorization: "Bearer token"
            },
            params: { caseId: existingCase.id },
            body: secondRequestBody,
            nickname: "nickname"
          });

          await editRecommendedActions(secondRequest, response, next);
          expect(response.statusCode).toEqual(200);

          const createdRecommendedActions =
            await models.referral_letter_officer_recommended_action.findAll({
              where: {
                recommendedActionId: recommendedActionId1,
                referralLetterOfficerId: letterOfficer.id
              }
            });

          expect(createdRecommendedActions.length).toEqual(1);

          expect(createdRecommendedActions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                recommendedActionId: recommendedActionId1,
                referralLetterOfficerId: letterOfficer.id
              })
            ])
          );

          const otherCreatedRecommendedActions =
            await models.referral_letter_officer_recommended_action.findAll({
              where: {
                recommendedActionId: recommendedActionId1,
                referralLetterOfficerId: otherLetterOfficer.id
              }
            });

          expect(otherCreatedRecommendedActions.length).toEqual(1);

          expect(otherCreatedRecommendedActions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                recommendedActionId: recommendedActionId1,
                referralLetterOfficerId: otherLetterOfficer.id
              })
            ])
          );
        });

        test("removes existing recommendedAction notes", async () => {
          let recommendedActionNotes = "some notes";
          let requestBody = {
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

          recommendedActionNotes = "";

          requestBody = {
            id: referralLetter.id,
            letterOfficers: [{ id: letterOfficer.id, recommendedActionNotes }]
          };

          const request2 = httpMocks.createRequest({
            method: "PUT",
            headers: {
              authorization: "Bearer token"
            },
            params: { caseId: existingCase.id },
            body: requestBody,
            nickname: "nickname"
          });
          await editRecommendedActions(request2, response, next);

          expect(response.statusCode).toEqual(200);
          await letterOfficer.reload();
          expect(letterOfficer.recommendedActionNotes).toEqual(
            recommendedActionNotes
          );
        });
      });
    });
  });
});
