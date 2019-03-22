import models from "../index";
import RaceEthnicity from "../../../client/testUtilities/raceEthnicity";
import Civilian from "../../../client/testUtilities/civilian";
import {
  ACCUSED,
  COMPLAINANT,
  PERSON_TYPE
} from "../../../sharedUtilities/constants";
import Case from "../../../client/testUtilities/case";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import Officer from "../../../client/testUtilities/Officer";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

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
        .withOfficerId(officer.id)
        .withCreatedAt(new Date("2018-09-22"))
        .withRoleOnCase(ACCUSED);

      secondAccusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
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

    test("returns correct accused officer when added first", async () => {
      const sortedCase = await models.sortable_cases_view.findOne({
        where: { id: existingCase.id }
      });

      expect(sortedCase).toEqual(
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

      expect(sortedCase).toEqual(
        expect.objectContaining({
          accusedPersonType: null,
          accusedFirstName: null,
          accusedMiddleName: null,
          accusedLastName: null,
          id: existingCase.id
        })
      );
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

      expect(sortedCase).toEqual(
        expect.objectContaining({
          accusedPersonType: PERSON_TYPE.UNKNOWN_OFFICER,
          accusedFirstName: null,
          accusedMiddleName: null,
          accusedLastName: null,
          id: existingCase.id
        })
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
