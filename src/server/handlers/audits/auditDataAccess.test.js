import auditDataAccess from "./auditDataAccess";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../models";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

describe("auditDataAccess", () => {
  const user = "testuser";
  let caseId;
  const auditSubject = "auditSubject";

  beforeEach(async () => {
    const existingCase = await createTestCaseWithoutCivilian(user);
    caseId = existingCase.id;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create an audit with auditDetails", async () => {
    const auditDetails = {
      associationName: { attributes: ["field1", "field2", "otherField"] },
      otherAssociationName: {
        attributes: ["fieldA", "FieldB", "anotherField"]
      }
    };

    await auditDataAccess(user, caseId, auditSubject, auditDetails);

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
        caseId: caseId,
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
