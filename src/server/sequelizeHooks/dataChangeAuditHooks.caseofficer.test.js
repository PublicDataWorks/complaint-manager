import Case from "../../sharedTestHelpers/case";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import Officer from "../../sharedTestHelpers/Officer";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

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
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should audit caseofficer creation", async () => {
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "case_officer"
          }
        }
      ]
    });

    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelId).toEqual(
      createdCase.accusedOfficers[0].id
    );
    expect(audit.referenceId).toEqual(createdCase.id);
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      {
        "Officer Name": createdCase.accusedOfficers[0].fullName
      }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });

  test("should audit caseofficer destroy and exclude deletedAt from changes", async () => {
    const caseOfficer = createdCase.accusedOfficers[0];
    await caseOfficer.destroy({ auditUser: "someone" });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_DELETED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "case_officer"
          }
        }
      ]
    });

    expect(audit.dataChangeAudit.changes.deleted_at).not.toBeDefined();
    expect(audit.dataChangeAudit.changes.deletedAt).not.toBeDefined();
  });
});
