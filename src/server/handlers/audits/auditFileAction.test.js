import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../sharedUtilities/constants";
import { auditFileAction } from "./auditFileAction";
import models from "../../policeDataManager/models";

describe("auditFileAction", () => {
  const testUser = "Obi-Wan Kenobi";
  const testFilename = "archives/incomplete/kamino";
  let existingCase;

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create fileAudit", async () => {
    await models.sequelize.transaction(async transaction => {
      await auditFileAction(
        testUser,
        existingCase.id,
        AUDIT_ACTION.DOWNLOADED,
        testFilename,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        transaction
      );
    });

    const fileAudit = await models.audit.findOne({
      where: {
        auditAction: AUDIT_ACTION.DOWNLOADED
      },
      include: [
        {
          as: "fileAudit",
          model: models.file_audit
        }
      ]
    });

    expect(fileAudit).toEqual(
      expect.objectContaining({
        auditAction: AUDIT_ACTION.DOWNLOADED,
        user: testUser,
        referenceId: existingCase.id,
        managerType: "complaint",
        fileAudit: expect.objectContaining({
          fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
          fileName: testFilename
        })
      })
    );
  });
});
