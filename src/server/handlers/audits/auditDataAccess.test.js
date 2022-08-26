import auditDataAccess from "./auditDataAccess";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import models from "../../policeDataManager/models";
import { AUDIT_ACTION, MANAGER_TYPE } from "../../../sharedUtilities/constants";

describe("auditDataAccess", () => {
  const user = "testuser";
  let referenceId;
  const auditSubject = "auditSubject";

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const existingCase = await createTestCaseWithoutCivilian(user);
    referenceId = existingCase.id;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should create an audit with auditDetails", async () => {
    const auditDetails = {
      associationName: { attributes: ["field1", "field2", "otherField"] },
      otherAssociationName: {
        attributes: ["fieldA", "FieldB", "anotherField"]
      }
    };

    await auditDataAccess(
      user,
      referenceId,
      MANAGER_TYPE.COMPLAINT,
      auditSubject,
      auditDetails
    );

    const audit = await models.audit.findOne({
      where: {
        auditAction: AUDIT_ACTION.DATA_ACCESSED
      },
      include: [
        {
          model: models.data_access_audit,
          as: "dataAccessAudit",
          include: [
            {
              model: models.data_access_value,
              as: "dataAccessValues"
            }
          ]
        }
      ]
    });

    expect(audit).toEqual(
      expect.objectContaining({
        referenceId: referenceId,
        managerType: "complaint",
        user: user,
        dataAccessAudit: expect.objectContaining({
          auditSubject: auditSubject,
          dataAccessValues: expect.arrayContaining([
            expect.objectContaining({
              association: "associationName",
              fields: ["field1", "field2", "otherField"]
            }),
            expect.objectContaining({
              association: "otherAssociationName",
              fields: ["anotherField", "fieldA", "FieldB"]
            })
          ])
        })
      })
    );
  });
});
