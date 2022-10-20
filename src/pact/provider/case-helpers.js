import { random } from "lodash";
import { COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";
import models from "../../server/policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import IntakeSource from "../../server/testHelpers/intakeSource";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import Civilian from "../../sharedTestHelpers/civilian";

export const setupCase = async () => {
  try {
    models.cases.destroy({ where: {}, truncate: true, auditUser: "user" });

    const intakeSource = await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(random(5, 99999)),
      { auditUser: "user" }
    );

    const c = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withComplaintType("Civilian Within NOPD Initiated")
        .withIntakeSourceId(intakeSource.id),
      {
        auditUser: "user"
      }
    );

    return c;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addComplainantOfficerToCase = async c4se => {
  try {
    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    const caseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(officer.id)
        .withCaseId(c4se.id)
        .withRoleOnCase(COMPLAINANT),
      { auditUser: "user" }
    );

    return caseOfficer;
  } catch (error) {
    console.log(error);
  }
};

export const addWitnessOfficerToCase = async c4se => {
  try {
    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    const caseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(officer.id)
        .withCaseId(c4se.id)
        .withRoleOnCase(WITNESS),
      { auditUser: "user" }
    );

    return caseOfficer;
  } catch (error) {
    console.log(error);
  }
};

export const addCivilianToCase = async (theCase, role) => {
  return await models.civilian.create(
    new Civilian.Builder()
      .defaultCivilian()
      .withId(role === WITNESS ? 2 : 1)
      .withCaseId(theCase.id)
      .withRoleOnCase(role)
      .build(),
    { auditUser: "user" }
  );
};
