import models from "../models/index";
import { ACCUSED, COMPLAINANT } from "../../sharedUtilities/constants";
import Case from "../../client/testUtilities/case";
import Classification from "../../client/testUtilities/classification";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import Officer from "../../client/testUtilities/Officer";
import RaceEthnicity from "../../client/testUtilities/raceEthnicity";

export const createCaseWithoutCivilian = async (user = "someone") => {
  const initialCase = await models.cases.create(
    new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([]),
    { auditUser: user }
  );

  return initialCase;
};

export const createCaseWithCivilian = async () => {
  await models.race_ethnicity.create(
    new RaceEthnicity.Builder().defaultRaceEthnicity(),
    {
      auditUser: "someone"
    }
  );
  const initialCase = await models.cases.create(
    new Case.Builder().defaultCase().withId(undefined),
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

  return initialCase;
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

  const classificationAttributes = new Classification.Builder()
    .defaultClassification()
    .withId(undefined);

  const classification = await models.classification.create(
    classificationAttributes,
    {
      auditUser: "test"
    }
  );

  const defaultCaseAttributes = new Case.Builder()
    .defaultCase()
    .withId(undefined)
    .withClassificationId(classification.id)
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
  { model: models.case_officer, as: "accusedOfficers", auditUser: "someone" },
  { model: models.classification, as: "classification", auditUser: "someone" }
];
