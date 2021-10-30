import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../policeDataManager/models";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import Case from "../../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import editOfficerHistory from "./editOfficerHistory";
import httpMocks from "node-mocks-http";
import LetterOfficer from "../../../../testHelpers/LetterOfficer";
import ReferralLetterOfficerHistoryNote from "../../../../testHelpers/ReferralLetterOfficerHistoryNote";
import Boom from "boom";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

describe("edit referral letter", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  let existingCase, referralLetter, caseOfficer, response, next;

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
      .withCaseId(existingCase.id);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );
  });

  describe("officer histories (letter officers with history notes)", () => {
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
    });

    describe("no existing letter officer yet", () => {
      test("saves the letter officers if they do not exist yet", async () => {
        const requestBody = {
          letterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: []
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);
        const createdLetterOfficers = await models.letter_officer.findAll({
          where: { caseOfficerId: caseOfficer.id },
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(createdLetterOfficers.length).toEqual(1);
        const createdLetterOfficer = createdLetterOfficers[0];
        expect(createdLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(createdLetterOfficer.numHistoricalHighAllegations).toEqual(2);
        expect(createdLetterOfficer.numHistoricalMedAllegations).toEqual(3);
        expect(createdLetterOfficer.numHistoricalLowAllegations).toEqual(4);
        expect(createdLetterOfficer.historicalBehaviorNotes).toEqual(
          "<p>notes here</p>"
        );
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("adds notes that are new on new letter officer, allowing blank on either case num or details", async () => {
        const requestBody = {
          letterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                },
                {
                  tempId: "l9jwPODm8",
                  pibCaseNumber: "CC20180222-CS",
                  details: ""
                },
                {
                  tempId: "aid9e8slj",
                  pibCaseNumber: "",
                  details: "We didn't know the case reference on this one"
                }
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);
        const createdLetterOfficer = await models.letter_officer.findOne({
          where: { caseOfficerId: caseOfficer.id },
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(3);
        expect(createdLetterOfficer.referralLetterOfficerHistoryNotes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              referralLetterOfficerId: createdLetterOfficer.id,
              pibCaseNumber: "CC20180101-CS",
              details: "This case was very similar"
            }),
            expect.objectContaining({
              referralLetterOfficerId: createdLetterOfficer.id,
              pibCaseNumber: "CC20180222-CS",
              details: ""
            }),
            expect.objectContaining({
              referralLetterOfficerId: createdLetterOfficer.id,
              pibCaseNumber: "",
              details: "We didn't know the case reference on this one"
            })
          ])
        );
      });

      test("doesn't save new empty notes", async () => {
        const requestBody = {
          letterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "",
                  details: "   "
                }
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);
        const createdLetterOfficer = await models.letter_officer.findOne({
          where: { caseOfficerId: caseOfficer.id },
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(
          createdLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("throws error for new letter officers with case officers that do not exist", async () => {
        const requestBody = {
          letterOfficers: [
            {
              caseOfficerId: 9999,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: []
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
        await editOfficerHistory(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_OFFICER)
        );

        const createdLetterOfficers = await models.letter_officer.findAll();
        expect(createdLetterOfficers.length).toEqual(0);
      });

      test("rolls back first officer if second officer fails", async () => {
        const requestBody = {
          letterOfficers: [
            {
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: []
            },
            {
              caseOfficerId: 99999,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: []
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
        await editOfficerHistory(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_OFFICER)
        );

        const createdLetterOfficers = await models.letter_officer.findAll();
        expect(createdLetterOfficers.length).toEqual(0);
      });
    });

    describe("existing letter officer", () => {
      let letterOfficer;
      beforeEach(async () => {
        const letterOfficerAttributes = new LetterOfficer.Builder()
          .defaultLetterOfficer()
          .withId(undefined)
          .withCaseOfficerId(caseOfficer.id)
          .withNumHistoricalHighAllegations(2)
          .withNumHistoricalMedAllegations(3)
          .withNumHistoricalLowAllegations(1)
          .withHistoricalBehaviorNotes("some historical behavior notes");

        letterOfficer = await models.letter_officer.create(
          letterOfficerAttributes,
          { auditUser: "test" }
        );
      });

      test("updates the letter officers if they exist", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: []
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);

        const updatedLetterOfficer = await letterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(updatedLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(updatedLetterOfficer.numHistoricalHighAllegations).toEqual(9);
        expect(updatedLetterOfficer.numHistoricalMedAllegations).toEqual(8);
        expect(updatedLetterOfficer.numHistoricalLowAllegations).toEqual(0);
        expect(updatedLetterOfficer.historicalBehaviorNotes).toEqual(
          "<p>updated notes</p>"
        );
        expect(
          updatedLetterOfficer.referralLetterOfficerHistoryNotes.length
        ).toEqual(0);
      });

      test("updates the letter officers, handling undefined, null, or blank string numbers", async () => {
        const officerHistoryOption = await models.officer_history_option.create(
          { name: "New recruit" },
          { auditUser: "test" }
        );
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: null,
              numHistoricalMedAllegations: undefined,
              numHistoricalLowAllegations: "",
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: [],
              officerHistoryOption: `${officerHistoryOption.id}`
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);

        await letterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(letterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(letterOfficer.numHistoricalHighAllegations).toEqual(null);
        expect(letterOfficer.numHistoricalMedAllegations).toEqual(null);
        expect(letterOfficer.numHistoricalLowAllegations).toEqual(null);
        expect(letterOfficer.historicalBehaviorNotes).toEqual(
          "<p>updated notes</p>"
        );
        expect(letterOfficer.referralLetterOfficerHistoryNotes.length).toEqual(
          0
        );
        expect(letterOfficer.officerHistoryOptionId).toEqual(
          officerHistoryOption.id
        );
      });

      test("adds notes that are new on existing letter officer", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                },
                {
                  tempId: "l9jwPODm8",
                  pibCaseNumber: "CC20180222-CS",
                  details: "This case was also very similar"
                }
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);
        await letterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(letterOfficer.referralLetterOfficerHistoryNotes.length).toEqual(
          2
        );
        expect(letterOfficer.referralLetterOfficerHistoryNotes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              referralLetterOfficerId: letterOfficer.id,
              pibCaseNumber: "CC20180101-CS",
              details: "This case was very similar"
            }),
            expect.objectContaining({
              referralLetterOfficerId: letterOfficer.id,
              pibCaseNumber: "CC20180222-CS",
              details: "This case was also very similar"
            })
          ])
        );
      });

      test("doesn't save new empty notes", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  tempId: "Tiq08TBqr",
                  pibCaseNumber: "",
                  details: "   "
                }
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
        await editOfficerHistory(request, response, next);

        expect(response.statusCode).toEqual(200);
        await letterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(letterOfficer.referralLetterOfficerHistoryNotes.length).toEqual(
          0
        );
      });

      test("throws error for letter officers with id that does not match existing one", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: 555555555,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: []
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

        await editOfficerHistory(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_LETTER_OFFICER)
        );

        const updatedLetterOfficer = await models.letter_officer.findByPk(
          555555555
        );
        expect(updatedLetterOfficer).toBeNull();
      });

      test("throws error if try to change case officer id on existing letter officer", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: 888888,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 9,
              numHistoricalMedAllegations: 8,
              numHistoricalLowAllegations: 0,
              historicalBehaviorNotes: "<p>updated notes</p>",
              referralLetterOfficerHistoryNotes: []
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

        await editOfficerHistory(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(
            BAD_REQUEST_ERRORS.INVALID_LETTER_OFFICER_CASE_OFFICER_COMBINATION
          )
        );

        const updatedLetterOfficer = await letterOfficer.reload();
        expect(updatedLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
        expect(updatedLetterOfficer.historicalBehaviorNotes).toEqual(
          "some historical behavior notes"
        );
      });

      test("throws error for notes that do not exist", async () => {
        const requestBody = {
          letterOfficers: [
            {
              id: letterOfficer.id,
              caseOfficerId: caseOfficer.id,
              fullName: caseOfficer.fullName,
              numHistoricalHighAllegations: 2,
              numHistoricalMedAllegations: 3,
              numHistoricalLowAllegations: 4,
              historicalBehaviorNotes: "<p>new notes here</p>",
              referralLetterOfficerHistoryNotes: [
                {
                  id: 999999,
                  pibCaseNumber: "CC20180101-CS",
                  details: "This case was very similar"
                }
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
        await editOfficerHistory(request, response, next);
        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_OFFICER_HISTORY_NOTE)
        );

        await letterOfficer.reload({
          include: [
            {
              model: models.referral_letter_officer_history_note,
              as: "referralLetterOfficerHistoryNotes"
            }
          ]
        });
        expect(letterOfficer.referralLetterOfficerHistoryNotes.length).toEqual(
          0
        );
      });

      describe("existing notes", () => {
        let note1, note2;
        beforeEach(async () => {
          const note1Attributes = new ReferralLetterOfficerHistoryNote.Builder()
            .defaultReferralLetterOfficerHistoryNote()
            .withId(undefined)
            .withPibCaseNumber("CC2018NOTE1")
            .withDetails("first note original details")
            .withReferralLetterOfficerId(letterOfficer.id);
          note1 = await models.referral_letter_officer_history_note.create(
            note1Attributes,
            { auditUser: "someone" }
          );
          const note2Attributes = new ReferralLetterOfficerHistoryNote.Builder()
            .defaultReferralLetterOfficerHistoryNote()
            .withId(undefined)
            .withPibCaseNumber("CC2018NOTE2")
            .withDetails("second note original details")
            .withReferralLetterOfficerId(letterOfficer.id);
          note2 = await models.referral_letter_officer_history_note.create(
            note2Attributes,
            { auditUser: "someone" }
          );
        });

        test("edits notes that already exist on existing letter officer", async () => {
          const requestBody = {
            letterOfficers: [
              {
                id: letterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note1.id,
                    pibCaseNumber: "CC2018NOTE1edited",
                    details: "Note 1 edited details"
                  },
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
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
          await editOfficerHistory(request, response, next);

          expect(response.statusCode).toEqual(200);
          await letterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            letterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(2);
          expect(letterOfficer.referralLetterOfficerHistoryNotes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note1.id,
                referralLetterOfficerId: letterOfficer.id,
                pibCaseNumber: "CC2018NOTE1edited",
                details: "Note 1 edited details"
              }),
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: letterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });

        test("deletes existing notes that aren't submitted in request", async () => {
          const requestBody = {
            letterOfficers: [
              {
                id: letterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
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
          await editOfficerHistory(request, response, next);

          expect(response.statusCode).toEqual(200);
          await letterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            letterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(1);
          expect(letterOfficer.referralLetterOfficerHistoryNotes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: letterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });

        test("deletes existing notes that come in blank", async () => {
          const requestBody = {
            letterOfficers: [
              {
                id: letterOfficer.id,
                caseOfficerId: caseOfficer.id,
                fullName: caseOfficer.fullName,
                numHistoricalHighAllegations: 2,
                numHistoricalMedAllegations: 3,
                numHistoricalLowAllegations: 4,
                historicalBehaviorNotes: "<p>notes here</p>",
                referralLetterOfficerHistoryNotes: [
                  {
                    id: note1.id,
                    pibCaseNumber: "",
                    details: "    "
                  },
                  {
                    id: note2.id,
                    pibCaseNumber: "CC2018NOTE2edited",
                    details: "Note 2 edited details"
                  }
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
          await editOfficerHistory(request, response, next);

          expect(response.statusCode).toEqual(200);
          await letterOfficer.reload({
            include: [
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes"
              }
            ]
          });
          expect(
            letterOfficer.referralLetterOfficerHistoryNotes.length
          ).toEqual(1);
          expect(letterOfficer.referralLetterOfficerHistoryNotes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: note2.id,
                referralLetterOfficerId: letterOfficer.id,
                pibCaseNumber: "CC2018NOTE2edited",
                details: "Note 2 edited details"
              })
            ])
          );
        });
      });
    });
  });
});
