import models from "../complaintManager/models/index";
import { ACCUSED, COMPLAINANT } from "../../sharedUtilities/constants";
import Case from "../../client/complaintManager/testUtilities/case";
import CaseOfficer from "../../client/complaintManager/testUtilities/caseOfficer";
import Officer from "../../sharedTestHelpers/Officer";
import RaceEthnicity from "../../client/complaintManager/testUtilities/raceEthnicity";
import Civilian from "../../client/complaintManager/testUtilities/civilian";

export const createTestCaseWithoutCivilian = async (user = "someone") => {
  return await models.cases.create(
    new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([]),
    { auditUser: user }
  );
};

export const createTestCaseWithCivilian = async () => {
  await models.race_ethnicity.create(
    new RaceEthnicity.Builder().defaultRaceEthnicity(),
    {
      auditUser: "someone"
    }
  );

  const complainantCivilian = new Civilian.Builder()
    .defaultCivilian()
    .withRoleOnCase(COMPLAINANT)
    .withNoAddress()
    .withId(undefined)
    .withCaseId(undefined);

  return await models.cases.create(
    new Case.Builder()
      .defaultCase()
      .withId(undefined)
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
};

export const createCase = async customCaseAttributes => {
  const complainantOfficerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withFirstName("Bruce")
    .withLastName("Mario")
    .withOfficerNumber(1)
    .withId(undefined);

  const complainantOfficer = await models.officer.create(
    complainantOfficerAttributes,
    {
      auditUser: "test"
    }
  );

  const accusedOfficerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withOfficerNumber(2)
    .withId(undefined);

  const accusedOfficer = await models.officer.create(accusedOfficerAttributes, {
    auditUser: "test"
  });

  const defaultCaseAttributes = new Case.Builder()
    .defaultCase()
    .withId(undefined)
    .withComplainantOfficers([
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(complainantOfficer.id)
        .withId(undefined)
        .withRoleOnCase(COMPLAINANT)
    ])
    .withAccusedOfficers([
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(accusedOfficer.id)
        .withId(undefined)
        .withRoleOnCase(ACCUSED)
    ]);

  const caseAttributes = { ...defaultCaseAttributes, ...customCaseAttributes };

  return await models.cases.create(caseAttributes, {
    include: caseAssociationsToInclude,
    auditUser: "someone"
  });
};

const caseAssociationsToInclude = [
  { model: models.address, as: "incidentLocation", auditUser: "test" },
  { model: models.civilian, as: "complainantCivilians", auditUser: "someone" },
  {
    model: models.case_officer,
    as: "complainantOfficers",
    auditUser: "someone"
  },
  { model: models.case_officer, as: "accusedOfficers", auditUser: "someone" }
];
