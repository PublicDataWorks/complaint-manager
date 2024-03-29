import models from "../index";
import RaceEthnicity from "../../../../sharedTestHelpers/raceEthnicity";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
  ACCUSED,
  COMPLAINANT,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../sharedTestHelpers/Officer";
import Tag from "../../../testHelpers/tag";
import CaseTag from "../../../testHelpers/caseTag";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { seedPersonTypes } from "../../../testHelpers/testSeeding";

describe("sortableCasesView", () => {
  let personTypes;
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
    personTypes = await seedPersonTypes();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("check correct accused officer", () => {
    let accusedOfficer, secondAccusedOfficer, existingCase, officer;

    beforeEach(async () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);

      officer = await models.officer.create(officerAttributes, {
        auditUser: "user"
      });

      accusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withFirstName("First")
        .withOfficerId(officer.id)
        .withCreatedAt(new Date("2018-09-22"))
        .withRoleOnCase(ACCUSED);

      secondAccusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withFirstName("Second")
        .withOfficerId(officer.id)
        .withCreatedAt(new Date("2018-09-23"))
        .withRoleOnCase(ACCUSED);

      existingCase = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withId(undefined)
          .withIncidentDate("2012-12-01")
          .withFirstContactDate("2012-12-02")
          .withAccusedOfficers([accusedOfficer, secondAccusedOfficer]),
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

    test("doesn't return deleted accused officer", async () => {
      await (
        await models.case_officer.findOne({
          where: {
            firstName: "First"
          }
        })
      ).destroy({ auditUser: "someone" });

      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase.accusedOfficers).not.toContain(
        expect.objectContaining({
          accusedFirstName: accusedOfficer.firstName,
          accusedMiddleName: accusedOfficer.middleName,
          accusedLastName: accusedOfficer.lastName,
          accusedPersonType: "Known Officer",
          id: existingCase.id
        })
      );
    });

    test("returns no accused officer id when no accused officer is present", async () => {
      existingCase = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withId(undefined)
          .withIncidentDate("2012-12-01")
          .withFirstContactDate("2012-12-02"),
        {
          auditUser: "someone"
        }
      );

      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase.accusedOfficers).toEqual([]);
    });
  });

  describe("check correct primary complainant", () => {
    let complainantCivilian, complainantCaseOfficer, existingCase, officer;

    describe("with permissions", () => {
      beforeEach(async () => {
        const raceEthnicity = await models.race_ethnicity.create(
          new RaceEthnicity.Builder().defaultRaceEthnicity(),
          {
            auditUser: "someone"
          }
        );

        const officerAttributes = new Officer.Builder()
          .defaultOfficer()
          .withId(undefined);

        officer = await models.officer.create(officerAttributes, {
          auditUser: "user"
        });

        complainantCivilian = new Civilian.Builder()
          .defaultCivilian()
          .withLastName("Shane")
          .withRaceEthnicityId(raceEthnicity.id)
          .withRoleOnCase(COMPLAINANT)
          .withNoAddress()
          .withCreatedAt(new Date("2018-06-12"))
          .withId(undefined)
          .withCaseId(undefined)
          .withPersonType(personTypes[2].key);

        complainantCaseOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(undefined)
          .withOfficerId(officer.id)
          .withCreatedAt(new Date("2018-09-22"))
          .withRoleOnCase(COMPLAINANT)
          .withPersonTypeKey(personTypes[1].key);

        existingCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withIncidentDate("2012-12-01")
            .withFirstContactDate("2012-12-02")
            .withComplainantCivilians([complainantCivilian])
            .withComplainantOfficers([complainantCaseOfficer]),
          {
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
            ],
            auditUser: "someone",
            permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
          }
        );
      });

      test("returns civilian as primary complainant when added first", async () => {
        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            complainantFirstName: complainantCivilian.firstName,
            complainantMiddleName: complainantCivilian.middleInitial,
            complainantLastName: complainantCivilian.lastName,
            id: existingCase.id
          })
        );
      });

      test("returns appropriate case reference prefix when civilian primary complainant", async () => {
        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            caseReference: `${personTypes[2].abbreviation}2012-0001`
          })
        );
      });

      test("should return AC prefix in case reference when primary complainant is anonymized", async () => {
        const caseCivilian = await models.civilian.findOne({
          where: { caseId: existingCase.id }
        });

        await models.civilian.update(
          { isAnonymous: true },
          {
            where: { id: caseCivilian.id },
            auditUser: "test user"
          }
        );
        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            caseReference: "AC2012-0001"
          })
        );
      });

      test("returns officer as primary complainant when added first", async () => {
        await models.case_officer.update(
          {
            createdAt: new Date("2016-06-12")
          },
          {
            where: {
              officerId: officer.id
            },
            auditUser: "test user"
          }
        );

        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            complainantPersonType: personTypes[1].description,
            complainantFirstName: complainantCaseOfficer.firstName,
            complainantMiddleName: complainantCaseOfficer.middleName,
            complainantLastName: complainantCaseOfficer.lastName,
            id: existingCase.id
          })
        );
      });

      test("returns appropriate case reference prefix when officer is primary complainant", async () => {
        await models.case_officer.update(
          {
            createdAt: new Date("2016-06-12")
          },
          {
            where: {
              officerId: officer.id
            },
            auditUser: "test user"
          }
        );

        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            caseReference: `${personTypes[1].abbreviation}2012-0001`
          })
        );
      });

      test("should return appropriate prefix in case reference when primary complainant is deleted", async () => {
        await models.civilian.destroy({
          where: { caseId: existingCase.id },
          auditUser: "test user"
        });
        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });
        expect(sortedCase).toEqual(
          expect.objectContaining({
            caseReference: `${personTypes[1].abbreviation}2012-0001`
          })
        );
      });

      test("no complainant", async () => {
        existingCase = await models.cases.create(
          new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withIncidentDate("2012-12-01")
            .withFirstContactDate("2012-12-02"),
          {
            auditUser: "someone"
          }
        );

        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            complainantPersonType: personTypes[0].description,
            complainantFirstName: null,
            complainantMiddleName: null,
            complainantLastName: null,
            id: existingCase.id
          })
        );
      });

      test("returns unknown officer as primary complainant when added first", async () => {
        const unknownOfficerAttributes = new CaseOfficer.Builder()
          .withCaseId(existingCase.id)
          .withRoleOnCase(COMPLAINANT)
          .withCreatedAt(new Date("2010-02-12"))
          .withId(undefined)
          .withFirstName(null)
          .withLastName(null)
          .withMiddleName(null)
          .withOfficerId(null);

        await models.case_officer.create(unknownOfficerAttributes, {
          auditUser: "someone"
        });
        const sortedCase = await models.sortable_cases_view.findOne({
          where: { id: existingCase.id }
        });

        expect(sortedCase).toEqual(
          expect.objectContaining({
            complainantPersonType: "Unknown Officer",
            complainantFirstName: null,
            complainantMiddleName: null,
            complainantLastName: null,
            id: existingCase.id
          })
        );
      });
    });
  });

  test("should return all associated tags", async () => {
    const c4se = await models.cases.create(
      new Case.Builder().defaultCase().build(),
      {
        auditUser: "user"
      }
    );

    const tag1 = await models.tag.create(
      new Tag.Builder().defaultTag().withId(1).withName("tag1").build(),
      { auditUser: "user" }
    );
    const tag2 = await models.tag.create(
      new Tag.Builder().defaultTag().withId(2).withName("tag2").build(),
      { auditUser: "user" }
    );
    const tag3 = await models.tag.create(
      new Tag.Builder().defaultTag().withId(3).withName("tag3").build(),
      { auditUser: "user" }
    );
    const tag4 = await models.tag.create(
      new Tag.Builder().defaultTag().withId(4).withName("tag4").build(),
      { auditUser: "user" }
    );
    const tag5 = await models.tag.create(
      new Tag.Builder().defaultTag().withId(5).withName("tag4").build(),
      { auditUser: "user" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(c4se.id)
        .withTagId(tag1.id)
        .withId(1),
      { auditUser: "user" }
    );
    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(c4se.id)
        .withTagId(tag2.id)
        .withId(2)
        .build(),
      { auditUser: "user" }
    );
    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(c4se.id)
        .withTagId(tag3.id)
        .withId(3)
        .build(),
      { auditUser: "user" }
    );
    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(c4se.id)
        .withTagId(tag4.id)
        .withId(4)
        .build(),
      { auditUser: "user" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(c4se.id)
        .withTagId(tag5.id)
        .withId(5)
        .build(),
      { auditUser: "user" }
    );

    const cases = await models.sortable_cases_view.findAll();
    expect(cases[0].tagNames).toEqual(
      expect.arrayContaining([tag1.name, tag2.name, tag3.name, tag4.name])
    );
  });

  test("should return null without failing when getting primaryComplainant when complainantPersonType is null", async () => {
    await models.cases.create(new Case.Builder().defaultCase().build(), {
      auditUser: "user"
    });
    const cases = await models.sortable_cases_view.findAll();
    expect(cases[0].primaryComplainant).toBeNull();
    expect(cases[0].caseReference).toStartWith(personTypes[0].abbreviation);
  });
});
