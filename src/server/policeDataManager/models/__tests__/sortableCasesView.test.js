import models from "../index";
import RaceEthnicity from "../../../../sharedTestHelpers/raceEthnicity";
import Civilian from "../../../../sharedTestHelpers/civilian";
import { ACCUSED, COMPLAINANT } from "../../../../sharedUtilities/constants";
import Case from "../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../sharedTestHelpers/Officer";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import sortableCasesView from "../sortableCasesView";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("sortableCasesView", () => {
  afterEach(async () => {
    await cleanupDatabase();
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
          accusedPersonType: PERSON_TYPE.KNOWN_OFFICER,
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

    test("returns accused officer id but no accused officer name when an unknown officer added first", async () => {
      const unknownOfficerAttributes = new CaseOfficer.Builder()
        .withCaseId(existingCase.id)
        .withRoleOnCase(ACCUSED)
        .withCreatedAt(new Date("2010-02-12"))
        .withId(undefined)
        .withFirstName(null)
        .withLastName(null)
        .withMiddleName(null)
        .withOfficerId(null);

      const unknownOfficer = await models.case_officer.create(
        unknownOfficerAttributes,
        {
          auditUser: "someone"
        }
      );
      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase.accusedOfficers[2]).toEqual(
        // TODO fix once sorting is in place
        {
          fullName: "Unknown Officer",
          personType: "Unknown Officer"
        }
      );
    });
  });

  describe("check correct primary complainant", () => {
    let complainantCivilian, complainantCaseOfficer, existingCase, officer;

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
        .withCaseId(undefined);

      complainantCaseOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(officer.id)
        .withCreatedAt(new Date("2018-09-22"))
        .withRoleOnCase(COMPLAINANT);

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
          auditUser: "someone"
        }
      );
    });

    test("returns civilian as primary complainant when added first", async () => {
      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase).toEqual(
        expect.objectContaining({
          complainantPersonType: PERSON_TYPE.CIVILIAN,
          complainantFirstName: complainantCivilian.firstName,
          complainantMiddleName: complainantCivilian.middleInitial,
          complainantLastName: complainantCivilian.lastName,
          id: existingCase.id
        })
      );
    });

    test("returns CC as case reference prefix when civilian primary complainant", async () => {
      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase).toEqual(
        expect.objectContaining({
          caseReference: "CC2012-0001"
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
          complainantPersonType: PERSON_TYPE.KNOWN_OFFICER,
          complainantFirstName: complainantCaseOfficer.firstName,
          complainantMiddleName: complainantCaseOfficer.middleName,
          complainantLastName: complainantCaseOfficer.lastName,
          id: existingCase.id
        })
      );
    });

    test("returns PO as case reference prefix when officer primary complainant", async () => {
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
          caseReference: "PO2012-0001"
        })
      );
    });

    test("should return PO as prefix in case reference when primary complainant is deleted", async () => {
      await models.civilian.destroy({
        where: { caseId: existingCase.id },
        auditUser: "test user"
      });
      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });
      expect(sortedCase).toEqual(
        expect.objectContaining({
          caseReference: "PO2012-0001"
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
          complainantPersonType: null,
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
          complainantPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
          complainantFirstName: null,
          complainantMiddleName: null,
          complainantLastName: null,
          id: existingCase.id
        })
      );
    });
  });
});
