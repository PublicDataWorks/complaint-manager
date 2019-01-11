import models from "../index";
import { createCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import Civilian from "../../../client/testUtilities/civilian";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Boom from "boom";
import Case from "../../../client/testUtilities/case";

describe("cases", function() {
  let createdCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("caseReference", () => {
    test("returns a case reference starting with CC for civilian complainant", () => {
      const civilianCaseAttributes = new Case.Builder()
        .defaultCase()
        .withComplaintType(CIVILIAN_INITIATED)
        .withIncidentDate("2017-01-01")
        .withFirstContactDate("2018-04-20")
        .withId(555);
      const civilianCase = models.cases.build(civilianCaseAttributes);
      expect(civilianCase.caseReference).toEqual("CC2018-0555");
    });

    test("returns a case reference starting with PO for officer complainant", () => {
      const officerCaseAttributes = new Case.Builder()
        .defaultCase()
        .withComplaintType(RANK_INITIATED)
        .withIncidentDate("2000-05-26")
        .withFirstContactDate("2002-05-17")
        .withId(12);
      const officerCase = models.cases.build(officerCaseAttributes);
      expect(officerCase.caseReference).toEqual("PO2002-0012");
    });
  });

  describe("setStatus", async () => {
    beforeEach(async () => {
      createdCase = await createCaseWithoutCivilian();
    });

    test("sets status to given status when allowed", async () => {
      await createdCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);
    });

    test("does not update status from active to initial", async () => {
      await createdCase.update(
        { narrativeSummary: "new summary" },
        { auditUser: "someone" }
      );
      await createdCase.reload();

      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);

      expect(
        createdCase.update(
          { status: CASE_STATUS.INITIAL },
          { auditUser: "someone" }
        )
      ).rejects.toEqual(Boom.badRequest("Invalid case status"));

      await createdCase.reload();

      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);
    });

    test("does not update status from ready for review to initial", async () => {
      await createdCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await createdCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await createdCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);

      expect(
        createdCase.update(
          { status: CASE_STATUS.INITIAL },
          { auditUser: "someone" }
        )
      ).rejects.toEqual(Boom.badRequest("Invalid case status"));
      await createdCase.reload();

      expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);
    });

    test("does not update status from initial to ready for review", async () => {
      expect(
        createdCase.update(
          { status: CASE_STATUS.READY_FOR_REVIEW },
          { auditUser: "someone" }
        )
      ).rejects.toEqual(Boom.badRequest("Invalid case status"));

      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    });

    test("does not update status from ready for review to active", async () => {
      await createdCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await createdCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await createdCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);

      expect(
        createdCase.update(
          { status: CASE_STATUS.ACTIVE },
          { auditUser: "someone" }
        )
      ).rejects.toEqual(Boom.badRequest("Invalid case status"));

      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);
    });

    test("allows status to stay the same", async () => {
      await createdCase.update(
        { status: CASE_STATUS.INITIAL },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    });
  });

  describe("status beforeUpdate hook", async () => {
    beforeEach(async () => {
      createdCase = await createCaseWithoutCivilian();
    });

    test("should not change status when updating nothing", async () => {
      await createdCase.update({}, { auditUser: "Someone" });

      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    });

    test("should change status from initial to active when updating something", async () => {
      await createdCase.update(
        { assignedTo: "someone else" },
        { auditUser: "Someone" }
      );

      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);
    });

    test("should changes status when updating through class update", async () => {
      await models.cases.update(
        { assignedTo: "someone else" },
        { where: { id: createdCase.id }, auditUser: "Someone" }
      );

      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);
    });

    test("should NOT update case status to Active when not Initial", async () => {
      const civilianToAdd = new Civilian.Builder()
        .defaultCivilian()
        .withRoleOnCase("Complainant")
        .withId(undefined)
        .build();

      const anotherCivilianToAdd = new Civilian.Builder()
        .defaultCivilian()
        .withRoleOnCase("Witness")
        .withId(undefined)
        .build();

      await createdCase.createComplainantCivilian(civilianToAdd, {
        auditUser: "someone"
      });
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);

      await createdCase.update(
        { status: "Letter in Progress" },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.LETTER_IN_PROGRESS);

      await createdCase.createWitnessCivilian(anotherCivilianToAdd, {
        auditUser: "someone"
      });
      await createdCase.reload();
      expect(createdCase.status).toEqual(CASE_STATUS.LETTER_IN_PROGRESS);
    });

    test("should not update case status to active when main update fails", async () => {
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
      try {
        await createdCase.update({ createdBy: null }, { auditUser: "someone" });
      } catch (error) {}
      await createdCase.reload();
      expect(createdCase.createdBy).not.toBeNull();
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    });
  });
});
