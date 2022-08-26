import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import CaseStatus from "../../../../../sharedTestHelpers/caseStatus";
import models from "../../../../policeDataManager/models";
import auditUpload from "./auditUpload";

describe("auditUpload", () => {
  let caseForAudit;

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    caseForAudit = await createTestCaseWithoutCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it should populate details correctly after upload to s3", async () => {
    await models.sequelize.transaction(async transaction => {
      await auditUpload(
        "user",
        caseForAudit.id,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        { fileName: ["testFile.txt"] }
      );
    });

    const createdAudits = await models.action_audit.findAll({
      where: { caseId: caseForAudit.id }
    });
    expect(createdAudits.length).toEqual(1);

    expect(createdAudits[0].user).toEqual("user");
    expect(createdAudits[0].caseId).toEqual(caseForAudit.id);
    expect(createdAudits[0].subject).toEqual(
      AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF
    );
    expect(createdAudits[0].auditDetails).toEqual(
      expect.objectContaining({
        fileName: ["testFile.txt"]
      })
    );
    expect(createdAudits[0].action).toEqual(AUDIT_ACTION.UPLOADED);
    expect(createdAudits[0].auditType).toEqual(AUDIT_TYPE.UPLOAD);
  });
});
