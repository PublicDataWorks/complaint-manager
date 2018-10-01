import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import ReferralLetterOfficerHistoryNote from "../../../../client/testUtilities/ReferralLetterOfficerHistoryNote";
import ReferralLetterOfficer from "../../../../client/testUtilities/ReferralLetterOfficer";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";
import getReferralLetter from "./getReferralLetter";
import httpMocks from "node-mocks-http";

describe("getReferralLetter", () => {
  let existingCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

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

  test("it returns needed letter data when there is already a letter and letter officers and notes created", async () => {
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
      { auditUser: "test" }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);

    const referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );

    const referralLetterOfficerAttributes = new ReferralLetterOfficer.Builder()
      .defaultReferralLetterOfficer()
      .withId(undefined)
      .withReferralLetterId(referralLetter.id)
      .withCaseOfficerId(caseOfficer.id)
      .withNumberHistoricalHighAllegations(2)
      .withNumberHistoricalMediumAllegations(3)
      .withNumberHistoricalLowAllegations(1)
      .withHistoricalBehaviorNotes("some historical behavior notes");

    const referralLetterOfficer = await models.referral_letter_officer.create(
      referralLetterOfficerAttributes,
      { auditUser: "test" }
    );

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
      referralLetterOfficers: [
        {
          id: referralLetterOfficer.id,
          caseOfficerId: referralLetterOfficer.caseOfficerId,
          fullName: caseOfficer.fullName,
          numberHistoricalHighAllegations:
            referralLetterOfficer.numberHistoricalHighAllegations,
          numberHistoricalMediumAllegations:
            referralLetterOfficer.numberHistoricalMediumAllegations,
          numberHistoricalLowAllegations:
            referralLetterOfficer.numberHistoricalLowAllegations,
          historicalBehaviorNotes:
            referralLetterOfficer.historicalBehaviorNotes,
          referralLetterOfficerHistoryNotes: [
            {
              id: referralLetterOfficerHistoryNote.id,
              pibCaseNumber: referralLetterOfficerHistoryNote.pibCaseNumber,
              details: referralLetterOfficerHistoryNote.details,
              referralLetterOfficerId: referralLetterOfficer.id
            }
          ]
        }
      ]
    };

    await getReferralLetter(request, response, next);
    expect(response._getData()).toEqual(expectedResponseBody);
  });
});
