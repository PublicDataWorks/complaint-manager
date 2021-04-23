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
import { PERSON_TYPE } from "../../../../instance-files/constants";

describe("getCases", () => {
  afterEach(async () => {
    await cleanupDatabase();
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
    const createCaseInStatus = async finalStatus => {
      const createdCase = await models.cases.create(
        new Case.Builder().defaultCase().withId(undefined),
        { auditUser: "user" }
      );

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
          caseWithNoAccused;

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
            .withId(undefined)
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

        secondCaseWithKnownAccused = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
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
            .withId(undefined)
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
          new Case.Builder().defaultCase().withId(undefined),
          {
            auditUser: "test"
          }
        );
      });

      test("gets correct order for ascending", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER,
          ASCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: caseWithNoAccused.id,
            accusedPersonType: null
          }),
          expect.objectContaining({
            id: caseWithUnknownAccused.id,
            accusedPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
            accusedLastName: null
          }),
          expect.objectContaining({
            id: secondCaseWithKnownAccused.id,
            accusedLastName: "Allen"
          }),
          expect.objectContaining({
            id: firstCaseWithKnownAccused.id,
            accusedLastName: "Bruce"
          })
        ]);
      });

      test("gets correct order for descending", async () => {
        const sortedCases = await getCases(
          CASES_TYPE.WORKING,
          SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER,
          DESCENDING
        );

        expect(sortedCases.rows).toEqual([
          expect.objectContaining({
            id: firstCaseWithKnownAccused.id,
            accusedLastName: "Bruce"
          }),

          expect.objectContaining({
            id: secondCaseWithKnownAccused.id,
            accusedLastName: "Allen"
          }),
          expect.objectContaining({
            id: caseWithUnknownAccused.id,
            accusedPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
            accusedLastName: null
          }),
          expect.objectContaining({
            id: caseWithNoAccused.id,
            accusedPersonType: null
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
            complainantPersonType: null
          }),
          expect.objectContaining({
            complainantPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
            complainantLastName: null,
            complainantFirstName: null,
            complainantMiddleName: null
          }),
          expect.objectContaining({
            complainantLastName: "Bo"
          }),
          expect.objectContaining({
            complainantLastName: "Zebra"
          }),
          expect.objectContaining({
            complainantLastName: "Andie"
          }),
          expect.objectContaining({
            complainantLastName: "bard"
          }),
          expect.objectContaining({
            complainantLastName: "Shane"
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
            complainantLastName: "Shane"
          }),
          expect.objectContaining({
            complainantLastName: "bard"
          }),
          expect.objectContaining({
            complainantLastName: "Andie"
          }),
          expect.objectContaining({
            complainantLastName: "Zebra"
          }),
          expect.objectContaining({
            complainantLastName: "Bo"
          }),
          expect.objectContaining({
            complainantPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
            complainantLastName: null,
            complainantFirstName: null,
            complainantMiddleName: null
          }),
          expect.objectContaining({
            complainantPersonType: null
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

    describe("by tags", () => {
      let case1, case2, case3;
      let tag1, tag2, tag3;
      let caseTag1, caseTag2, caseTag3;
      
      beforeEach(async () => {
        case1 = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(13)
            .withAssignedTo("zmail"),
          { auditUser: "test" }
        );
        case2 = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(14)
            .withAssignedTo("bmail"),
          { auditUser: "test" }
        );
        case3 = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(15)
            .withAssignedTo("email"),
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
        )
        
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
  });
});
