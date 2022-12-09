import { random } from "lodash";
import { ACCUSED, COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";
import models from "../../server/policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import IntakeSource from "../../server/testHelpers/intakeSource";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import Civilian from "../../sharedTestHelpers/civilian";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const setupCase = async () => {
  try {
    models.cases.destroy({ where: {}, truncate: true, auditUser: "user" });

    const intakeSource = await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(random(5, 99999)),
      { auditUser: "user" }
    );

    const civilianWithinPdInitiated = await models.complaintTypes.create({
      name: CIVILIAN_WITHIN_PD_INITIATED
    });

    const c = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withComplaintTypeId(civilianWithinPdInitiated.id)
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

export const addComplainantOfficerToCase = async (c4se, caseOfficerId) => {
  try {
    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    let buildOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerId(officer.id)
      .withCaseId(c4se.id)
      .withRoleOnCase(COMPLAINANT);

    if (caseOfficerId) {
      buildOfficer = buildOfficer.withId(caseOfficerId);
    }

    const caseOfficer = await models.case_officer.create(buildOfficer, {
      auditUser: "user"
    });

    return caseOfficer;
  } catch (error) {
    console.log(error);
  }
};

export const addWitnessOfficerToCase = async (c4se, caseOfficerId) => {
  try {
    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    let buildOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerId(officer.id)
      .withCaseId(c4se.id)
      .withRoleOnCase(WITNESS);

    if (caseOfficerId) {
      buildOfficer = buildOfficer.withId(caseOfficerId);
    }

    const caseOfficer = await models.case_officer.create(buildOfficer, {
      auditUser: "user"
    });

    return caseOfficer;
  } catch (error) {
    console.log(error);
  }
};

export const addAccusedOfficerToCase = async c4se => {
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
        .withRoleOnCase(ACCUSED),
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
