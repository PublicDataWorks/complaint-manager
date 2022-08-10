import models from "../index";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT
} from "../../../../sharedUtilities/constants";
import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../testHelpers/requestTestHelpers";
import Boom from "boom";
import Case from "../../../../sharedTestHelpers/case";
import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";

import { range, shuffle } from "lodash";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../sharedTestHelpers/Officer";

describe("cases", function () {
  let createdCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
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

    test("generates case number when validate is true", async () => {
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

    test("generates case number even when validate false", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      caseAttributes.year = 1900;
      caseAttributes.caseNumber = 99;
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone",
        validate: false
      });
      expect(newCase.year).toEqual(2018);
      expect(newCase.caseNumber).toEqual(1);
    });

    test(
      "does not allow bulk create for now",
      suppressWinstonLogs(async () => {
        //don't know requirements of what we'd want with a bulk create - generating case reference
        const caseAttributes = new Case.Builder()
          .defaultCase()
          .withFirstContactDate("2018-04-20")
          .withId(null);
        await expect(
          models.cases.bulkCreate([caseAttributes], {
            auditUser: "someone"
          })
        ).rejects.toEqual(
          Boom.badRequest(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED)
        );
      })
    );

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

      await expect(
        newCase.update({ caseNumber: 88, year: 1901 }, { auditUser: "someone" })
      ).rejects.toEqual(
        Boom.badData(BAD_DATA_ERRORS.CANNOT_OVERRIDE_CASE_REFERENCE)
      );
      await newCase.reload();
      expect(newCase.year).toEqual(2018);
      expect(newCase.caseNumber).toEqual(1);
    });

    test("does not allow you to override year or case number on instance update, even with validate false", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });

      await expect(
        newCase.update(
          { caseNumber: 88, year: 1901 },
          { validate: false, auditUser: "someone" }
        )
      ).rejects.toEqual(
        Boom.badData(BAD_DATA_ERRORS.CANNOT_OVERRIDE_CASE_REFERENCE)
      );
      await newCase.reload();
      expect(newCase.year).toEqual(2018);
      expect(newCase.caseNumber).toEqual(1);
    });

    test("does not allow you to override reference number when doing bulk update", async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-04-20")
        .withId(null);
      const newCase = await models.cases.create(caseAttributes, {
        auditUser: "someone"
      });

      expect(
        models.cases.update(
          { caseNumber: 88, year: 1901 },
          { where: { id: newCase.id }, validate: false, auditUser: "someone" }
        )
      ).rejects.toEqual(
        Boom.badData(BAD_DATA_ERRORS.CANNOT_OVERRIDE_CASE_REFERENCE)
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
      const deletedCase = await models.cases.findByPk(newCase.id, {
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
          "Case Reference": "CC2018-0001"
        }
      ]);
    });
  });

  describe("caseReference", () => {
    let complainantOfficer;
    let civilian;
    let caseAttributes;
    let complainantCase;

    beforeEach(async () => {
      complainantOfficer = await createCaseOfficer();
      civilian = new Civilian.Builder().defaultCivilian();
    });

    const createCaseAttributesBasedOnComplainants = (
      complainantCivilians,
      complainantOfficers
    ) => {
      return new Case.Builder()
        .defaultCase()
        .withComplainantCivilians(complainantCivilians)
        .withComplainantOfficers(complainantOfficers)
        .withIncidentDate("2017-01-01")
        .withFirstContactDate("2016-04-20")
        .withId(555);
    };

    const createCaseOfficer = async () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);

      const officer = await models.officer.create(officerAttributes, {
        auditUser: "user"
      });

      return new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(officer.id)
        .withCreatedAt(new Date("2018-09-22"))
        .withRoleOnCase(COMPLAINANT);
    };

    const createCase = caseAttributes => {
      return models.cases.create(caseAttributes, {
        auditUser: "someone",
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "someone"
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            auditUser: "someone"
          }
        ]
      });
    };

    test("returns a case reference starting with CC for civilian initiated case", async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants([], []);

      complainantCase = await createCase(caseAttributes);

      expect(complainantCase.caseReference).toEqual("CC2016-0001");
    });

    test("returns current case reference even if first contact year has changed", async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants([], []);

      complainantCase = await createCase(caseAttributes);

      await complainantCase.update(
        { firstContactDate: "2014-01-01" },
        { auditUser: "someone" }
      );

      expect(complainantCase.caseReference).toEqual("CC2016-0001");
    });

    test("returns a case reference starting with PO for rank initiated complainant", async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants(
        [],
        [complainantOfficer]
      );

      complainantCase = await createCase(caseAttributes);

      expect(complainantCase.caseReference).toEqual("PO2016-0001");
    });

    test("should return case reference starting with AC when primary complainant is anonymous", async () => {
      civilian.withIsAnonymous(true);

      caseAttributes = createCaseAttributesBasedOnComplainants([civilian], []);

      complainantCase = await createCase(caseAttributes);

      expect(complainantCase.caseReference).toEqual("AC2016-0001");
    });

    test("should return case reference starting with CC when primary civilian complainant is no longer anonymous", async () => {
      civilian.withIsAnonymous(true);

      caseAttributes = createCaseAttributesBasedOnComplainants([civilian], []);

      complainantCase = await createCase(caseAttributes);

      const initialCaseReference = complainantCase.caseReference;

      civilian.withIsAnonymous(false);

      await complainantCase.update(
        { complainantCivilians: [civilian] },
        {
          auditUser: "someone",
          include: [
            {
              model: models.civilian,
              as: "complainantCivilians",
              auditUser: "someone"
            }
          ]
        }
      );
      expect(initialCaseReference).toEqual("AC2016-0001");
      expect(complainantCase.caseReference).toEqual("CC2016-0001");
    });

    test("should return case reference starting with AC with multiple complainants where only primary complainant is anonymous ", async () => {
      civilian.withIsAnonymous(true).withCreatedAt(new Date("2017-01-01"));

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilian],
        [complainantOfficer]
      );

      complainantCase = await createCase(caseAttributes);

      const complainants = [
        ...complainantCase.complainantCivilians,
        ...complainantCase.complainantOfficers
      ];
      expect(complainants.length).toEqual(2);
      expect(complainantCase.primaryComplainant.firstName).toEqual("Chuck");
      expect(complainantCase.caseReference).toEqual("AC2016-0001");
    });

    test("should return case reference starting with PO with multiple complainants where only primary PO complainant is not anonymous ", async () => {
      civilian.withIsAnonymous(true).withCreatedAt(new Date("2019-01-01"));

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilian],
        [complainantOfficer]
      );

      complainantCase = await createCase(caseAttributes);

      const complainants = [
        ...complainantCase.complainantCivilians,
        ...complainantCase.complainantOfficers
      ];
      expect(complainants.length).toEqual(2);
      expect(complainantCase.primaryComplainant.firstName).toEqual("Grant");
      expect(complainantCase.caseReference).toEqual("PO2016-0001");
    });

    test("should return case reference starting with AC when primary PO complainant is removed", async () => {
      civilian.withIsAnonymous(true).withCreatedAt(new Date("2019-01-01"));

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilian],
        [complainantOfficer]
      );

      complainantCase = await createCase(caseAttributes);

      const initialCaseReference = complainantCase.caseReference;
      await complainantCase.update(
        { complainantOfficers: [] },
        {
          auditUser: "someone",
          include: [
            {
              model: models.case_officer,
              as: "complainantOfficers",
              auditUser: "someone"
            }
          ]
        }
      );
      expect(initialCaseReference).toEqual("PO2016-0001");
      expect(complainantCase.primaryComplainant.firstName).toEqual("Chuck");
      expect(complainantCase.caseReference).toEqual("AC2016-0001");
    });

    test("should return case reference starting with CC when anonymous primary complainant is removed", async () => {
      complainantOfficer.withIsAnonymous(true);

      civilian.withCreatedAt(new Date("2019-01-01"));

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilian],
        [complainantOfficer]
      );

      complainantCase = await createCase(caseAttributes);

      const initialCaseReference = complainantCase.caseReference;
      await complainantCase.update(
        { complainantOfficers: [] },
        {
          auditUser: "someone",
          include: [
            {
              model: models.case_officer,
              as: "complainantOfficers",
              auditUser: "someone"
            }
          ]
        }
      );
      expect(initialCaseReference).toEqual("AC2016-0001");
      expect(complainantCase.primaryComplainant.firstName).toEqual("Chuck");
      expect(complainantCase.caseReference).toEqual("CC2016-0001");
    });
  });

  describe("setStatus", () => {
    beforeEach(async () => {
      createdCase = await createTestCaseWithoutCivilian();
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
      ).rejects.toEqual(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );

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
      ).rejects.toEqual(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
      await createdCase.reload();

      expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);
    });

    test("does not update status from initial to ready for review", async () => {
      expect(
        createdCase.update(
          { status: CASE_STATUS.READY_FOR_REVIEW },
          { auditUser: "someone" }
        )
      ).rejects.toEqual(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );

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
      ).rejects.toEqual(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );

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

  describe("status beforeUpdate hook", () => {
    beforeEach(async () => {
      createdCase = await createTestCaseWithoutCivilian();
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
      } catch (error) {
        console.error(error);
      }
      await createdCase.reload();
      expect(createdCase.createdBy).not.toBeNull();
      expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    });
    it("has primaryComplainant, the first existing case complainant", async () => {
      const complainants = shuffle(
        range(5).map(i => ({
          firstName: `${i}complainant`,
          lastName: `complainant${i}`,
          caseId: 1,
          roleOnCase: COMPLAINANT
        }))
      );
      const auditUser = "test";
      const caseAttributes = new Case.Builder().defaultCase().withId(1);
      let createdCase = await models.cases.create(caseAttributes, {
        auditUser
      });
      for (const complainant of complainants) {
        await createdCase.createComplainantCivilian(complainant, { auditUser });
      }
      createdCase = await models.cases.findByPk(1, {
        include: {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser
        }
      });
      expect(createdCase.primaryComplainant.lastName).toEqual(
        complainants[0].lastName
      );
    });
  });
});
