import {
  createTestCaseWithCivilian,
  createTestCaseWithoutCivilian
} from "../../../testHelpers/modelMothers";
import models from "../../../policeDataManager/models";
import getCases, { CASES_TYPE } from "./getCases";
import Case from "../../../../sharedTestHelpers/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import RaceEthnicity from "../../../../sharedTestHelpers/raceEthnicity";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
  ACCUSED,
  ASCENDING,
  CASE_STATUS,
  COMPLAINANT,
  DEFAULT_PAGINATION_LIMIT,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Tag from "../../../testHelpers/tag";
import CaseTag from "../../../testHelpers/caseTag";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("getCases", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("pagination", () => {
    test("should get cases on requested page", async () => {
      const numberOfResults = 25;
      for (let i = 0; i < numberOfResults; i++) {
        await createTestCaseWithoutCivilian();
      }
      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(
          CASES_TYPE.WORKING,
          transaction,
          ASCENDING,
          null,
          1
        );
      });
      expect(cases.rows.length).toEqual(DEFAULT_PAGINATION_LIMIT);
      expect(cases.count).toEqual(numberOfResults);
    });

    test("should get page 2 of cases when more then 20 cases", async () => {
      const numberOfResults = 25;
      for (let i = 0; i < numberOfResults; i++) {
        await createTestCaseWithoutCivilian();
      }
      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(
          CASES_TYPE.WORKING,
          transaction,
          ASCENDING,
          null,
          2
        );
      });
      expect(cases.rows.length).toEqual(
        numberOfResults - DEFAULT_PAGINATION_LIMIT
      );
      expect(cases.count).toEqual(numberOfResults);
    });
    test("should provide all results when no page provided", async () => {
      const numberOfResults = 25;
      for (let i = 0; i < numberOfResults; i++) {
        await createTestCaseWithoutCivilian();
      }
      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(CASES_TYPE.WORKING, transaction, ASCENDING);
      });
      expect(cases.rows.length).toEqual(numberOfResults);
      expect(cases.count).toEqual(numberOfResults);
    });
  });

  describe("working cases", () => {
    const auditUser = "user";
    let existingCase;

    beforeEach(async () => {
      existingCase = await createTestCaseWithCivilian();
    });

    test("should get all cases", async () => {
      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(CASES_TYPE.WORKING, transaction);
      });
      expect(cases.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: existingCase.id,
            complainantLastName: "Berry"
          })
        ])
      );
    });

    test("should not get archived cases", async () => {
      const existingArchivedCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined);
      const existingArchivedCase = await models.cases.create(
        existingArchivedCaseAttributes,
        {
          auditUser: auditUser
        }
      );
      await existingArchivedCase.destroy({ auditUser: auditUser });

      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(CASES_TYPE.WORKING, transaction);
      });

      expect(cases).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: existingArchivedCase.id })
        ])
      );
    });
  });

  describe("archived cases", () => {
    const auditUser = "user";
    let existingArchivedCase;
    beforeEach(async () => {
      existingArchivedCase = await createTestCaseWithCivilian();
      await existingArchivedCase.destroy({ auditUser: auditUser });
    });

    test("should get all archived cases", async () => {
      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(CASES_TYPE.ARCHIVED, transaction);
      });

      expect(cases.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: existingArchivedCase.id,
            complainantLastName: "Berry"
          })
        ])
      );

      expect(cases.rows).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            deletedAt: null
          })
        ])
      );
    });

    test("should not get unarchived case", async () => {
      const existingUnarchivedCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined);
      const existingUnarchivedCase = await models.cases.create(
        existingUnarchivedCaseAttributes,
        {
          auditUser: auditUser
        }
      );

      const cases = await models.sequelize.transaction(async transaction => {
        return await getCases(CASES_TYPE.ARCHIVED, transaction);
      });

      expect(cases).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: existingUnarchivedCase.id })
        ])
      );
    });
  });

  describe("sorting", () => {
    const createCaseInStatus = async (finalStatus, params) => {
      let builder = new Case.Builder().defaultCase();
      if (params) {
        if (params.id) {
          builder.withId(params.id);
        } else {
          builder.withId(undefined);
        }

        if (params.year) {
          builder.withYear(params.year);
        }

        if (params.caseNumber) {
          builder.withCaseNumber(params.caseNumber);
        }
      } else {
        builder.withId(undefined);
      }
      const createdCase = await models.cases.create(builder, {
        auditUser: "user"
      });

      while (createdCase.nextStatus !== null) {
        if (finalStatus === createdCase.status) {
          return createdCase;
        }
        await createdCase.update(
          { status: createdCase.nextStatus },
          {
            auditUser: "test"
          }
        );
      }
      return createdCase;
    };

    describe("by status", () => {
      let initialCase,
        activeCase,
        letterInProgressCase,
        readyForReviewCase,
        forwardedToAgencyCase,
        closedCase;

      beforeEach(async () => {
        activeCase = await createCaseInStatus(CASE_STATUS.ACTIVE);
        forwardedToAgencyCase = await createCaseInStatus(
          CASE_STATUS.FORWARDED_TO_AGENCY
        );
        readyForReviewCase = await createCaseInStatus(
          CASE_STATUS.READY_FOR_REVIEW
        );
        initialCase = await createCaseInStatus(CASE_STATUS.INITIAL);
        closedCase = await createCaseInStatus(CASE_STATUS.CLOSED);
        letterInProgressCase = await createCaseInStatus(
          CASE_STATUS.LETTER_IN_PROGRESS
        );
      });

      test("status in ascending order", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.STATUS,
          "asc"
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: initialCase.id,
            status: CASE_STATUS.INITIAL
          }),
          expect.objectContaining({
            id: activeCase.id,
            status: CASE_STATUS.ACTIVE
          }),
          expect.objectContaining({
            id: letterInProgressCase.id,
            status: CASE_STATUS.LETTER_IN_PROGRESS
          }),
          expect.objectContaining({
            id: readyForReviewCase.id,
            status: CASE_STATUS.READY_FOR_REVIEW
          }),
          expect.objectContaining({
            id: forwardedToAgencyCase.id,
            status: CASE_STATUS.FORWARDED_TO_AGENCY
          }),
          expect.objectContaining({
            id: closedCase.id,
            status: CASE_STATUS.CLOSED
          })
        ]);
      });

      test("status in descending order", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.STATUS,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: closedCase.id,
            status: CASE_STATUS.CLOSED
          }),
          expect.objectContaining({
            id: forwardedToAgencyCase.id,
            status: CASE_STATUS.FORWARDED_TO_AGENCY
          }),
          expect.objectContaining({
            id: readyForReviewCase.id,
            status: CASE_STATUS.READY_FOR_REVIEW
          }),
          expect.objectContaining({
            id: letterInProgressCase.id,
            status: CASE_STATUS.LETTER_IN_PROGRESS
          }),
          expect.objectContaining({
            id: activeCase.id,
            status: CASE_STATUS.ACTIVE
          }),
          expect.objectContaining({
            id: initialCase.id,
            status: CASE_STATUS.INITIAL
          })
        ]);
      });
    });

    describe("by case reference", () => {
      let firstCase, secondCase, thirdCase, fourthCase;

      beforeEach(async () => {
        firstCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2012-12-01")),
          {
            auditUser: "someone"
          }
        );

        secondCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2011-12-02")),
          {
            auditUser: "someone"
          }
        );

        thirdCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2011-3-02")),
          {
            auditUser: "someone"
          }
        );

        fourthCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2012-3-03")),
          {
            auditUser: "someone"
          }
        );
      });

      test("returns cases in order of descending case reference if no sort by or sort direction argument", async () => {
        const sortedCases = await getCases(CASES_TYPE.WORKING, null, null);

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: fourthCase.id,
            year: fourthCase.year,
            caseNumber: fourthCase.caseNumber
          }),
          expect.objectContaining({
            id: firstCase.id,
            year: firstCase.year,
            caseNumber: firstCase.caseNumber
          }),
          expect.objectContaining({
            id: thirdCase.id,
            year: thirdCase.year,
            caseNumber: thirdCase.caseNumber
          }),
          expect.objectContaining({
            id: secondCase.id,
            year: secondCase.year,
            caseNumber: secondCase.caseNumber
          })
        ]);
      });

      test("return cases in order of ascending case reference", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.CASE_REFERENCE,
          ASCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: secondCase.id,
            year: secondCase.year,
            caseNumber: secondCase.caseNumber
          }),
          expect.objectContaining({
            id: thirdCase.id,
            year: thirdCase.year,
            caseNumber: thirdCase.caseNumber
          }),
          expect.objectContaining({
            id: firstCase.id,
            year: firstCase.year,
            caseNumber: firstCase.caseNumber
          }),
          expect.objectContaining({
            id: fourthCase.id,
            year: fourthCase.year,
            caseNumber: fourthCase.caseNumber
          })
        ]);
      });

      test("return cases in order of descending case reference", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.CASE_REFERENCE,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: fourthCase.id,
            year: fourthCase.year,
            caseNumber: fourthCase.caseNumber
          }),
          expect.objectContaining({
            id: firstCase.id,
            year: firstCase.year,
            caseNumber: firstCase.caseNumber
          }),
          expect.objectContaining({
            id: thirdCase.id,
            year: thirdCase.year,
            caseNumber: thirdCase.caseNumber
          }),
          expect.objectContaining({
            id: secondCase.id,
            year: secondCase.year,
            caseNumber: secondCase.caseNumber
          })
        ]);
      });
    });

    describe("by accused officer", () => {
      let firstCaseWithKnownAccused,
        secondCaseWithKnownAccused,
        caseWithUnknownAccused,
        caseWithNoAccused,
        caseWithMultipleAccused;

      beforeEach(async () => {
        const firstOfficer = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withId(undefined)
            .withOfficerNumber(1)
        );

        const firstKnownOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(undefined)
          .withRoleOnCase(ACCUSED)
          .withOfficerId(firstOfficer.id)
          .withLastName("Bruce");

        firstCaseWithKnownAccused = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(5)
            .withAccusedOfficers([firstKnownOfficer]),
          {
            include: [
              {
                model: models.case_officer,
                as: "accusedOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const secondOfficer = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withId(undefined)
            .withOfficerNumber(2),
          {
            auditUser: "test"
          }
        );

        const secondKnownOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(undefined)
          .withRoleOnCase(ACCUSED)
          .withLastName("Allen")
          .withOfficerId(secondOfficer.id);

        const thirdOfficer = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withId(777)
            .withOfficerNumber(5),
          {
            auditUser: "test"
          }
        );

        const thirdKnownOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(999)
          .withRoleOnCase(ACCUSED)
          .withLastName("Aaron")
          .withOfficerId(thirdOfficer.id);

        secondCaseWithKnownAccused = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(6)
            .withAccusedOfficers([secondKnownOfficer]),
          {
            include: [
              {
                model: models.case_officer,
                as: "accusedOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        caseWithUnknownAccused = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(7)
            .withAccusedOfficers([
              new CaseOfficer.Builder()
                .withId(undefined)
                .withUnknownOfficer()
                .withRoleOnCase(ACCUSED)
            ]),
          {
            include: [
              {
                model: models.case_officer,
                as: "accusedOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        caseWithNoAccused = await models.cases.create(
          new Case.Builder().defaultCase().withId(8),
          {
            auditUser: "test"
          }
        );

        caseWithMultipleAccused = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(9)
            .withAccusedOfficers([
              secondKnownOfficer,
              new CaseOfficer.Builder()
                .withId(undefined)
                .withUnknownOfficer()
                .withRoleOnCase(ACCUSED),
              thirdKnownOfficer
            ]),
          {
            include: [
              {
                model: models.case_officer,
                as: "accusedOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );
      });

      test("gets correct order for ascending", async () => {
        // TODO fix after sorting is in place
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.ACCUSED_OFFICERS,
          ASCENDING
        );

        expect(sortedCases.rows.map(row => row.id)).toEqual([
          caseWithMultipleAccused.id,
          secondCaseWithKnownAccused.id,
          firstCaseWithKnownAccused.id,
          caseWithUnknownAccused.id,
          caseWithNoAccused.id
        ]);
      });

      test("gets correct order for descending", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.ACCUSED_OFFICERS,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: caseWithNoAccused.id
          }),
          expect.objectContaining({
            id: caseWithUnknownAccused.id
          }),
          expect.objectContaining({
            id: firstCaseWithKnownAccused.id
          }),
          expect.objectContaining({
            id: secondCaseWithKnownAccused.id
          }),
          expect.objectContaining({
            id: caseWithMultipleAccused.id
          })
        ]);
      });
    });

    describe("by complainant", () => {
      let firstCaseWithCivilian,
        secondCaseWithCivilian,
        thirdCaseWithCivilian,
        firstCaseWithOfficerComplainant,
        secondCaseWithOfficerComplainant,
        caseWithUnknownOfficerComplainant,
        caseWithoutComplainant;

      beforeEach(async () => {
        const raceEthnicity = await models.race_ethnicity.create(
          new RaceEthnicity.Builder().defaultRaceEthnicity(),
          {
            auditUser: "someone"
          }
        );

        const complainantCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withLastName("Shane")
          .withRaceEthnicityId(raceEthnicity.id)
          .withRoleOnCase(COMPLAINANT)
          .withNoAddress()
          .withId(undefined)
          .withCaseId(undefined);

        firstCaseWithCivilian = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withIncidentDate("2012-12-01")
            .withFirstContactDate("2012-12-02")
            .withComplainantCivilians([complainantCivilian]),
          {
            include: [
              {
                model: models.civilian,
                as: "complainantCivilians",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const secondCaseComplainantCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withLastName("Andie")
          .withRaceEthnicityId(raceEthnicity.id)
          .withRoleOnCase(COMPLAINANT)
          .withId(undefined)
          .withNoAddress()
          .withCaseId(undefined);

        secondCaseWithCivilian = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withIncidentDate("2013-02-23")
            .withFirstContactDate("2013-03-23")
            .withId(undefined)
            .withComplainantCivilians([secondCaseComplainantCivilian]),
          {
            include: [
              {
                model: models.civilian,
                as: "complainantCivilians",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const thirdComplainantCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withLastName("bard")
          .withRaceEthnicityId(raceEthnicity.id)
          .withRoleOnCase(COMPLAINANT)
          .withNoAddress()
          .withId(undefined)
          .withCaseId(undefined);

        thirdCaseWithCivilian = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withIncidentDate("2012-12-01")
            .withFirstContactDate("2012-12-02")
            .withComplainantCivilians([thirdComplainantCivilian]),
          {
            include: [
              {
                model: models.civilian,
                as: "complainantCivilians",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const firstOfficer = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withId(undefined)
            .withOfficerNumber(1),
          {
            auditUser: "user"
          }
        );

        const firstCaseOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withLastName("Bo")
          .withId(undefined)
          .withOfficerId(firstOfficer.id)
          .withRoleOnCase(COMPLAINANT);

        firstCaseWithOfficerComplainant = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withIncidentDate("2013-02-23")
            .withFirstContactDate("2013-03-23")
            .withId(undefined)
            .withComplainantOfficers([firstCaseOfficer]),
          {
            include: [
              {
                model: models.case_officer,
                as: "complainantOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const secondOfficer = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withId(undefined)
            .withOfficerNumber(2),
          {
            auditUser: "user"
          }
        );

        const secondCaseOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withLastName("Zebra")
          .withId(undefined)
          .withOfficerId(secondOfficer.id)
          .withRoleOnCase(COMPLAINANT);

        secondCaseWithOfficerComplainant = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withIncidentDate("2013-02-23")
            .withFirstContactDate("2013-03-23")
            .withId(undefined)
            .withComplainantOfficers([secondCaseOfficer]),
          {
            include: [
              {
                model: models.case_officer,
                as: "complainantOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        const unknownOfficer = new CaseOfficer.Builder()
          .withUnknownOfficer()
          .withRoleOnCase(COMPLAINANT);

        caseWithUnknownOfficerComplainant = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withIncidentDate("2013-02-23")
            .withFirstContactDate("2013-03-23")
            .withId(undefined)
            .withComplainantOfficers([unknownOfficer]),
          {
            include: [
              {
                model: models.case_officer,
                as: "complainantOfficers",
                auditUser: "someone"
              }
            ],
            auditUser: "someone"
          }
        );

        caseWithoutComplainant = await models.cases.create(
          new Case.Builder().defaultCase().withId(undefined),
          { auditUser: "someone" }
        );
      });

      afterEach(async () => {
        await cleanupDatabase();
      });

      test("get correct order for cases when sorting by complainant ascending", async () => {
        const cases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.PRIMARY_COMPLAINANT,
          ASCENDING
        );

        expect(cases.rows).toEqual([
          expect.objectContaining({
            complainantLastName: "Andie"
          }),
          expect.objectContaining({
            complainantLastName: "bard"
          }),
          expect.objectContaining({
            complainantLastName: "Bo"
          }),
          expect.objectContaining({
            complainantLastName: "Shane"
          }),
          expect.objectContaining({
            complainantLastName: "Zebra"
          }),
          expect.objectContaining({
            complainantPersonType: PERSON_TYPE.UNKNOWN_OFFICER.description,
            complainantLastName: null,
            complainantFirstName: null,
            complainantMiddleName: null
          }),
          expect.objectContaining({
            complainantPersonType: null
          })
        ]);
      });

      test("sort by complainant descending", async () => {
        const cases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.PRIMARY_COMPLAINANT,
          DESCENDING
        );

        expect(cases.rows).toEqual([
          expect.objectContaining({
            complainantPersonType: null
          }),
          expect.objectContaining({
            complainantPersonType: PERSON_TYPE.UNKNOWN_OFFICER.description,
            complainantLastName: null,
            complainantFirstName: null,
            complainantMiddleName: null
          }),
          expect.objectContaining({
            complainantLastName: "Zebra"
          }),
          expect.objectContaining({
            complainantLastName: "Shane"
          }),
          expect.objectContaining({
            complainantLastName: "Bo"
          }),
          expect.objectContaining({
            complainantLastName: "bard"
          }),
          expect.objectContaining({
            complainantLastName: "Andie"
          })
        ]);
      });
    });

    describe("by first contact date", () => {
      let earlierCase, laterCase, middleCase;
      beforeEach(async () => {
        middleCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2016-02-13")),
          { auditUser: "user" }
        );
        laterCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2017-02-13")),
          { auditUser: "user" }
        );
        earlierCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withFirstContactDate(new Date("2014-02-13")),
          { auditUser: "user" }
        );
      });

      test("gets cases in ascending contact date order", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          "firstContactDate",
          ASCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: earlierCase.id }),
          expect.objectContaining({ id: middleCase.id }),
          expect.objectContaining({ id: laterCase.id })
        ]);
      });

      test("gets cases in descending first contact date order", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.FIRST_CONTACT_DATE,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: laterCase.id }),
          expect.objectContaining({ id: middleCase.id }),
          expect.objectContaining({ id: earlierCase.id })
        ]);
      });
    });

    describe("by assigned to", () => {
      let firstCase, secondCase, thirdCase;

      beforeEach(async () => {
        firstCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withAssignedTo("zmail"),
          { auditUser: "test" }
        );
        secondCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withAssignedTo("bmail"),
          { auditUser: "test" }
        );
        thirdCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withAssignedTo("email"),
          { auditUser: "test" }
        );
      });

      test("cases are sorted in order of ascending assigned to", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.ASSIGNED_TO,
          ASCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: secondCase.id, assignedTo: "bmail" }),
          expect.objectContaining({ id: thirdCase.id, assignedTo: "email" }),
          expect.objectContaining({ id: firstCase.id, assignedTo: "zmail" })
        ]);
      });

      test("cases are sorted in order of descending assigned to", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.ASSIGNED_TO,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: firstCase.id, assignedTo: "zmail" }),
          expect.objectContaining({ id: thirdCase.id, assignedTo: "email" }),
          expect.objectContaining({ id: secondCase.id, assignedTo: "bmail" })
        ]);
      });
    });

    describe("by accused officers", () => {
      let officer1, officer2, officer3;
      let case1, case2;
      let caseOfficer1, caseOfficer2, caseOfficer3, caseOfficer4;

      beforeEach(async () => {
        case1 = await models.cases.create(
          new Case.Builder().defaultCase().withId(13).withAssignedTo("zmail"),
          { auditUser: "test" }
        );
        case2 = await models.cases.create(
          new Case.Builder().defaultCase().withId(14).withAssignedTo("bmail"),
          { auditUser: "test" }
        );

        officer1 = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withOfficerNumber(456)
            .withId(456)
            .build(),
          { auditUser: "test" }
        );

        officer2 = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withOfficerNumber(457)
            .withId(457)
            .build(),
          { auditUser: "test" }
        );

        officer3 = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withLastName("Old")
            .withOfficerNumber(458)
            .withId(458)
            .build(),
          { auditUser: "test" }
        );

        caseOfficer1 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(1)
            .withOfficerId(officer1.id)
            .withCaseId(case1.id)
            .withRoleOnCase(ACCUSED)
            .build(),
          { auditUser: "test" }
        );

        caseOfficer2 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(2)
            .withOfficerId(officer3.id)
            .withLastName("Old")
            .withCaseId(case1.id)
            .withRoleOnCase(ACCUSED)
            .build(),
          { auditUser: "test" }
        );

        caseOfficer3 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(3)
            .withOfficerId(officer1.id)
            .withCaseId(case2.id)
            .withRoleOnCase(ACCUSED)
            .build(),
          { auditUser: "test" }
        );

        caseOfficer4 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(4)
            .withOfficerId(officer2.id)
            .withCaseId(case2.id)
            .withRoleOnCase(ACCUSED)
            .build(),
          { auditUser: "test" }
        );
      });

      test("cases should return multiple accused officers", async () => {
        const cases = await getCases(CASES_TYPE.WORKING);
        expect(cases.rows[1].accusedOfficers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              fullName: "Grant M Young"
            }),
            expect.objectContaining({
              fullName: "Grant M Old"
            })
          ])
        );
      });

      test("accused officers should be sorted by last name then first name with unknown officers at the end", async () => {
        let officer4 = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withFirstName("Bob")
            .withMiddleName("M")
            .withLastName("Loblaw")
            .withOfficerNumber(470)
            .withId(470)
            .build(),
          { auditUser: "test" }
        );

        let officer5 = await models.officer.create(
          new Officer.Builder()
            .defaultOfficer()
            .withFirstName("Hope")
            .withMiddleName("M")
            .withLastName("Loblaw")
            .withOfficerNumber(471)
            .withId(471)
            .build(),
          { auditUser: "test" }
        );

        let caseOfficer5 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(88)
            .withOfficerId(officer1.id)
            .withCaseId(case1.id)
            .withRoleOnCase(ACCUSED)
            .withFirstName("Bob")
            .withLastName("Loblaw")
            .withFullName("Bob M Loblaw")
            .build(),
          { auditUser: "test" }
        );

        let caseOfficer6 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(89)
            .withOfficerId(officer4.id)
            .withCaseId(case1.id)
            .withRoleOnCase(ACCUSED)
            .withFirstName("Hope")
            .withLastName("Loblaw")
            .withFullName("Hope M Loblaw")
            .build(),
          { auditUser: "test" }
        );

        let caseOfficer7 = await models.case_officer.create(
          new CaseOfficer.Builder()
            .defaultCaseOfficer()
            .withId(90)
            .withOfficerId(officer5.id)
            .withCaseId(case1.id)
            .withRoleOnCase(ACCUSED)
            .withUnknownOfficer()
            .build(),
          { auditUser: "test" }
        );

        const cases = await getCases(CASES_TYPE.WORKING);
        expect(cases.rows[1].accusedOfficers).toEqual([
          {
            fullName: "Bob M Loblaw",
            personType: "Known Officer"
          },
          {
            fullName: "Hope M Loblaw",
            personType: "Known Officer"
          },
          {
            fullName: "Grant M Old",
            personType: "Known Officer"
          },
          {
            fullName: "Grant M Young",
            personType: "Known Officer"
          },
          {
            fullName: "Unknown Officer",
            personType: "Unknown Officer"
          }
        ]);
      });
    });
    describe("by tags", () => {
      let case1, case2, case3;
      let tag1, tag2, tag3;
      let caseTag1, caseTag2, caseTag3;

      beforeEach(async () => {
        case1 = await models.cases.create(
          new Case.Builder().defaultCase().withId(13).withAssignedTo("zmail"),
          { auditUser: "test" }
        );
        case2 = await models.cases.create(
          new Case.Builder().defaultCase().withId(14).withAssignedTo("bmail"),
          { auditUser: "test" }
        );
        case3 = await models.cases.create(
          new Case.Builder().defaultCase().withId(15).withAssignedTo("email"),
          { auditUser: "test" }
        );

        tag1 = await models.tag.create(
          new Tag.Builder().withId(1).withName("Pellentesque").build(),
          { auditUser: "test" }
        );

        tag2 = await models.tag.create(
          new Tag.Builder().withId(2).withName("Donec").build(),
          { auditUser: "test" }
        );

        tag3 = await models.tag.create(
          new Tag.Builder().withId(3).withName("Etiam").build(),
          { auditUser: "test" }
        );

        caseTag1 = await models.case_tag.create(
          new CaseTag.Builder()
            .defaultCaseTag()
            .withCaseId(case1.id)
            .withTagId(tag1.id)
            .build(),
          { auditUser: "test" }
        );

        caseTag2 = await models.case_tag.create(
          new CaseTag.Builder()
            .defaultCaseTag()
            .withCaseId(case2.id)
            .withTagId(tag3.id)
            .build(),
          { auditUser: "test" }
        );

        caseTag3 = await models.case_tag.create(
          new CaseTag.Builder()
            .defaultCaseTag()
            .withCaseId(case3.id)
            .withTagId(tag2.id)
            .build(),
          { auditUser: "test" }
        );
      });

      test("cases are sorted in order of ascending tags", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.TAGS,
          ASCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: case3.id }),
          expect.objectContaining({ id: case2.id }),
          expect.objectContaining({ id: case1.id })
        ]);
      });

      test("cases are sorted in order of descending tags", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.TAGS,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({ id: case1.id }),
          expect.objectContaining({ id: case2.id }),
          expect.objectContaining({ id: case3.id })
        ]);
      });
    });

    describe("by default", () => {
      let case1, case2, case3, case4;

      beforeEach(async () => {
        case1 = await createCaseInStatus(CASE_STATUS.INITIAL, {
          year: "2020",
          caseNumber: "0001",
          id: 1
        });

        case2 = await createCaseInStatus(CASE_STATUS.READY_FOR_REVIEW, {
          year: "2021",
          caseNumber: "0005",
          id: 2
        });

        case3 = await createCaseInStatus(CASE_STATUS.FORWARDED_TO_AGENCY, {
          year: "2021",
          caseNumber: "0007",
          id: 3
        });

        case4 = await createCaseInStatus(CASE_STATUS.READY_FOR_REVIEW, {
          year: "2021",
          caseNumber: "0010",
          id: 4
        });
      });

      test("should return Ready for Review then everything else sorted by case reference", async () => {
        const cases = await getCases(CASES_TYPE.WORKING);
        expect(cases).toEqual({
          count: 4,
          rows: [
            expect.objectContaining({ id: 4 }),
            expect.objectContaining({ id: 2 }),
            expect.objectContaining({ id: 3 }),
            expect.objectContaining({ id: 1 })
          ]
        });
      });
    });
  });
});
