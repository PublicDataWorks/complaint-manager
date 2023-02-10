import models from "../index";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
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
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

const {
  DEFAULT_PERSON_TYPE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("cases", function () {
  let createdCase, statuses;

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();
  });

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
      const complaintType = await models.complaintTypes.create({
        name: CIVILIAN_INITIATED
      });

      const civilianCaseAttributes = new Case.Builder()
        .defaultCase()
        .withComplaintTypeId(complaintType.id)
        .withIncidentDate("2017-01-01")
        .withFirstContactDate("2018-04-20")
        .withId(555);
      const civilianCase = await models.cases.create(civilianCaseAttributes, {
        auditUser: "someone"
      });
      expect(await civilianCase.modelDescription()).toEqual([
        {
          "Case Reference": `${DEFAULT_PERSON_TYPE.abbreviation}2018-0001`
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

    test("returns a case reference starting with default prefix case without complainants", async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants([], []);

      complainantCase = await createCase(caseAttributes);

      expect(complainantCase.caseReference).toEqual(
        `${DEFAULT_PERSON_TYPE.abbreviation}2016-0001`
      );
    });

    test("returns current case reference even if first contact year has changed", async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants([], []);

      complainantCase = await createCase(caseAttributes);

      await complainantCase.update(
        { firstContactDate: "2014-01-01" },
        { auditUser: "someone" }
      );

      expect(complainantCase.caseReference).toEqual(
        `${DEFAULT_PERSON_TYPE.abbreviation}2016-0001`
      );
    });

    if (PERSON_TYPE.KNOWN_OFFICER) {
      test("returns a case reference starting with PO for rank initiated complainant", async () => {
        caseAttributes = createCaseAttributesBasedOnComplainants(
          [],
          [complainantOfficer]
        );

        complainantCase = await createCase(caseAttributes);
        console.log(
          complainantCase.caseReferencePrefix,
          complainantCase.primaryComplainant
        );

        expect(complainantCase.caseReference).toEqual("PO2016-0001");
      });
    }

    test("should return case reference starting with AC when primary complainant is anonymous", async () => {
      civilian.withIsAnonymous(true);

      caseAttributes = createCaseAttributesBasedOnComplainants([civilian], []);

      complainantCase = await createCase(caseAttributes);

      expect(complainantCase.caseReference).toEqual("AC2016-0001");
    });

    if (PERSON_TYPE.CIVILIAN) {
      test("should return case reference starting with CC when primary civilian complainant is no longer anonymous", async () => {
        civilian.withIsAnonymous(true);

        caseAttributes = createCaseAttributesBasedOnComplainants(
          [civilian],
          []
        );

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
    }

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

    if (PERSON_TYPE.KNOWN_OFFICER) {
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
    }

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

      if (PERSON_TYPE.KNOWN_OFFICER) {
        expect(initialCaseReference).toEqual("PO2016-0001");
      }

      expect(complainantCase.primaryComplainant.firstName).toEqual("Chuck");
      expect(complainantCase.caseReference).toEqual("AC2016-0001");
    });

    if (PERSON_TYPE.CIVILIAN) {
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
    }
  });

  describe("setStatus", () => {
    beforeEach(async () => {
      createdCase = await createTestCaseWithoutCivilian();
    });

    test("sets status to given status when allowed", async () => {
      await createdCase.update(
        {
          statusId: statuses.find(status => status.name === "Active").id
        },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.statusId).toEqual(
        statuses.find(status => status.name === "Active").id
      );
    });

    test("allows status to stay the same", async () => {
      await createdCase.update(
        {
          statusId: statuses.find(status => status.name === "Initial").id
        },
        { auditUser: "someone" }
      );
      await createdCase.reload();
      expect(createdCase.statusId).toEqual(
        statuses.find(status => status.name === "Initial").id
      );
    });
  });

  describe("status beforeUpdate hook", () => {
    beforeEach(async () => {
      createdCase = await createTestCaseWithoutCivilian();
    });

    test("should not change status when updating nothing", async () => {
      await createdCase.update({}, { auditUser: "Someone" });

      await createdCase.reload();
      expect(createdCase.statusId).toEqual(
        statuses.find(status => status.name === "Initial").id
      );
    });

    test("has primaryComplainant, the first existing case complainant", async () => {
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

  test("should not be able to set a null narrative summary or pibCaseNumber", async () => {
    const c4se = await models.cases.create(new Case.Builder().defaultCase(), {
      auditUser: "user"
    });
    const { narrativeSummary, pibCaseNumber } = c4se.toJSON();
    c4se.narrativeSummary = null;
    c4se.pibCaseNumber = null;
    expect(c4se.narrativeSummary).toEqual(narrativeSummary);
    expect(c4se.pibCaseNumber).toEqual(pibCaseNumber);
  });
});
