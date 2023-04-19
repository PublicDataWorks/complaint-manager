import { random } from "lodash";
import { ACCUSED, COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";
import models from "../../server/policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import IntakeSource from "../../server/testHelpers/intakeSource";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import Civilian from "../../sharedTestHelpers/civilian";
import Inmate from "../../sharedTestHelpers/Inmate";
import CaseInmate from "../../sharedTestHelpers/CaseInmate";
import incompleteClassificationsDialogReducer from "../../client/policeDataManager/reducers/ui/incompleteClassificationsDialogReducer";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const setupCase = async () => {
  try {
    models.cases.destroy({ where: {}, truncate: true, auditUser: "user" });

    const intakeSource = await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(3),
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
    console.error(e);
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
      .withRoleOnCase(COMPLAINANT)
      .withPersonTypeKey("OFFICER");

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
      .withRoleOnCase(WITNESS)
      .withPersonTypeKey("OFFICER");

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

export const addComplainantPersonInCustodyToCase = async (c4se, inmateId) => {
  try {
    const personInCustody = await models.inmate.create(
      new Inmate.Builder().defaultInmate(),
      { auditUser: "user" }
    );

    let buildInmate = new CaseInmate.Builder()
      .defaultCaseInmate()
      .withInmateId(personInCustody.inmateId)
      .withCaseId(c4se.id)
      .withRoleOnCase(COMPLAINANT);

    if (inmateId) {
      buildInmate = buildInmate.withId(inmateId);
    }

    const caseInmate = await models.caseInmate.create(buildInmate, {
      auditUser: "user"
    });

    return caseInmate;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
