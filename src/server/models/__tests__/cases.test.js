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

  describe("beforeValidate hook (setup generation of case reference info)", () => {
    test("sets the year from the first contact date on create of case", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withIncidentDate("2017-01-01")
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      expect(newCase.year).toEqual(2018);
    });

    test("sets the year and the next case number for the case year on create", async () => {
      const caseAttributesFor2018 = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const case1For2018 = await models.cases.create(caseAttributesFor2018, {
        auditUser: "someone"
      });
      const caseAttributesFor2019 = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2019-04-20")
        .withId(null);
      const case1For2019 = await models.cases.create(caseAttributesFor2019, {
        auditUser: "someone"
      });
      const case2For2019 = await models.cases.create(caseAttributesFor2019, {
        auditUser: "someone"
      });

      expect(case1For2018.year).toEqual(2018);
      expect(case1For2018.caseNumber).toEqual(1);
      expect(case1For2019.year).toEqual(2019);
      expect(case1For2019.caseNumber).toEqual(1);
      expect(case2For2019.year).toEqual(2019);
      expect(case2For2019.caseNumber).toEqual(2);
    });

    test("does not try to take case number of an archived (soft deleted) case", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2019-04-20")
        .withId(null);
      const caseToArchive = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      expect(caseToArchive.year).toEqual(2019);
      expect(caseToArchive.caseNumber).toEqual(1);
      await caseToArchive.destroy({ auditUser: "someone" });
      expect(caseToArchive.reload()).rejects.toEqual(
        expect.objectContaining({
          message:
            "Instance could not be reloaded because it does not exist anymore (find call returned null)"
        })
      );

      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      expect(newCase.year).toEqual(2019);
      expect(newCase.caseNumber).toEqual(2);
    });

    test("overrides year and case number if someone passes them in on create", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      caseAttributes.year = 1900;
      caseAttributes.caseNumber = 99;
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      expect(newCase.year).toEqual(2018);
      expect(newCase.caseNumber).toEqual(1);
    });

    test("does not reset year or case number if case already exists in db", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      const updatedCase = await newCase.update(
        { firstContactDate: "2011-01-01" },
        { auditUser: "someone" }
      );
      expect(updatedCase.year).toEqual(2018);
      expect(updatedCase.caseNumber).toEqual(1);
      expect(updatedCase.firstContactDate).toEqual("2011-01-01");
    });

    test("does not allow you to override year or case number on update", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });

      expect(
        newCase.update({ caseNumber: 88, year: 1901 }, { auditUser: "someone" })
      ).rejects.toEqual(
        Boom.badData("Cannot override case reference information")
      );

      await newCase.reload();
      expect(newCase.year).toEqual(2018);
      expect(newCase.caseNumber).toEqual(1);
    });

    test("does not change year or case number on delete", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });
      await newCase.destroy({ auditUser: "someone" });
      const deletedCase = await models.cases.find({
        where: { id: newCase.id },
        paranoid: false
      });
      expect(deletedCase.year).toEqual(2018);
      expect(deletedCase.caseNumber).toEqual(1);
      expect(deletedCase.deletedAt).not.toBeNull();
    });
  });

  describe("modelDescription", () => {
    test("returns the case reference number", async () => {
      const civilianCaseAttributes = new Case.Builder()
        .defaultCase()
        .withComplaintType(CIVILIAN_INITIATED)
        .withIncidentDate("2017-01-01")
        .withFirstContactDate("2018-04-20")
        .withId(555);
      const civilianCase = await models.cases.create(civilianCaseAttributes, {
        auditUser: "someone"
      });
      expect(await civilianCase.modelDescription()).toEqual([
        {
          "Case Reference": "CC2018-0555"
        }
      ]);
    });
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
