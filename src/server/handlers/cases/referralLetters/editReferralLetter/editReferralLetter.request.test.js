import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../models";
import Case from "../../../../../client/testUtilities/case";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import request from "supertest";
import app from "../../../../server";

jest.mock("shortid", () => ({ generate: () => "uniqueTempId" }));

describe("edit referral letter", () => {
  describe("officer histories (letter officers with history notes)", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    let existingCase, referralLetter, caseOfficer;

    beforeEach(async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });

      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "test" }
      );

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

    test("saves the letter officers if they do not exist yet", async () => {
      const token = buildTokenWithPermissions("", "some_nickname");

      const requestBody = {
        referralLetterOfficers: [
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

      await request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(requestBody)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining({
              caseId: existingCase.id,
              id: referralLetter.id,
              referralLetterOfficers: expect.arrayContaining([
                expect.objectContaining({
                  caseOfficerId: caseOfficer.id,
                  fullName: caseOfficer.fullName,
                  historicalBehaviorNotes: "<p>notes here</p>",
                  referralLetterOfficerHistoryNotes: expect.arrayContaining([
                    expect.objectContaining({ tempId: "uniqueTempId" })
                  ])
                })
              ])
            })
          );
        });

      const createdLetterOfficers = await models.referral_letter_officer.findAll(
        {
          where: { caseOfficerId: caseOfficer.id }
        }
      );
      expect(createdLetterOfficers.length).toEqual(1);
      const createdLetterOfficer = createdLetterOfficers[0];
      expect(createdLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
      expect(createdLetterOfficer.numHistoricalHighAllegations).toEqual(2);
      expect(createdLetterOfficer.numHistoricalMedAllegations).toEqual(3);
      expect(createdLetterOfficer.numHistoricalLowAllegations).toEqual(4);
      expect(createdLetterOfficer.historicalBehaviorNotes).toEqual(
        "<p>notes here</p>"
      );
    });
  });
});
