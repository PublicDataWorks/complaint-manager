import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../models";
import Case from "../../../../../client/testUtilities/case";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import request from "supertest";
import app from "../../../../server";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

jest.mock("shortid", () => ({ generate: () => "uniqueTempId" }));

jest.mock("../../export/jobQueue");

describe("edit referral letter", () => {
  describe("officer histories (letter officers with history notes)", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    const token = buildTokenWithPermissions("", "some_nickname");
    let existingCase, referralLetter, caseOfficer;

    beforeEach(async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });

      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
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
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );

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

      await request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(requestBody)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual({});
        });

      const createdLetterOfficers = await models.letter_officer.findAll({
        where: { caseOfficerId: caseOfficer.id }
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
    });

    test("it returns 200 if case status is ready for review", async () => {
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );
      const requestBody = {
        letterOfficers: []
      };

      await request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(requestBody)
        .expect(200);
    });

    test(
      "return 400 cannot edit archived case when updating officer history of archived case",
      suppressWinstonLogs(async () => {
        await existingCase.update(
          { status: CASE_STATUS.LETTER_IN_PROGRESS },
          { auditUser: "test" }
        );
        await existingCase.update(
          { status: CASE_STATUS.READY_FOR_REVIEW },
          { auditUser: "test" }
        );

        await existingCase.destroy({ auditUser: "test" });

        await request(app)
          .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
          .set("Content-Header", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual(
              BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE
            );
          });
      })
    );

    test(
      "it returns 200 if case status is is after ready for review",
      suppressWinstonLogs(async () => {
        await existingCase.update(
          { status: CASE_STATUS.LETTER_IN_PROGRESS },
          { auditUser: "test" }
        );
        await existingCase.update(
          { status: CASE_STATUS.READY_FOR_REVIEW },
          { auditUser: "test" }
        );
        await existingCase.update(
          { status: CASE_STATUS.FORWARDED_TO_AGENCY },
          { auditUser: "test" }
        );
        await request(app)
          .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
          .set("Content-Header", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);
      })
    );
  });
});
