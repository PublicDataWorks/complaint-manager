import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../models";
import auditUpload from "./auditUpload";

describe("auditUpload", async () => {
  let caseForAudit;

  beforeEach(async () => {
    caseForAudit = await createTestCaseWithoutCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it should populate details correctly after upload to s3", async () => {
    await models.sequelize.transaction(async transaction => {
      await auditUpload(
        "user",
        caseForAudit.id,
        AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF
      );
    });

    const createdAudits = await models.action_audit.findAll({
      where: { caseId: caseForAudit.id }
    });
    expect(createdAudits.length).toEqual(1);

    expect(createdAudits[0].user).toEqual("user");
    expect(createdAudits[0].caseId).toEqual(caseForAudit.id);
    expect(createdAudits[0].subject).toEqual(
      AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF
    );
    expect(createdAudits[0].action).toEqual(AUDIT_ACTION.UPLOADED);
    expect(createdAudits[0].auditType).toEqual(AUDIT_TYPE.UPLOAD);
  });
});
