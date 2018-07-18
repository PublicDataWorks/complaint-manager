import Case from "../../client/testUtilities/case";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import Officer from "../../client/testUtilities/Officer";
import models from "../models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("dataChangeAudithooks caseofficer", () => {
  let createdCase;
  beforeEach(async () => {
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    const anAccusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerAttributes(anOfficer)
      .withNoSupervisor()
      .build();
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withAccusedOfficers([anAccusedOfficer])
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
  });

  afterEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "someone",
      force: true
    });
    await models.data_change_audit.truncate();
  });

  test("should audit caseofficer creation", async () => {
    const audit = await models.data_change_audit.find({
      where: { modelName: "Case Officer", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.user).toEqual("someone");
    expect(audit.modelId).toEqual(createdCase.accusedOfficers[0].id);
    expect(audit.caseId).toEqual(createdCase.id);
    expect(audit.modelDescription).toEqual([
      {
        "Officer Name": createdCase.accusedOfficers[0].fullName
      }
    ]);
  });

  test("should audit caseofficer destroy and exclude deletedAt from changes", async () => {
    const caseOfficer = createdCase.accusedOfficers[0];
    await caseOfficer.destroy({ auditUser: "someone" });

    const audit = await models.data_change_audit.find({
      where: { modelName: "Case Officer", action: AUDIT_ACTION.DATA_DELETED }
    });

    expect(audit.changes.deleted_at).not.toBeDefined();
    expect(audit.changes.deletedAt).not.toBeDefined();
  });
});
