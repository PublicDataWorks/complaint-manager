import models from "../models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../sharedUtilities/constants";

describe("data access audit", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("does not create audit on access audit creation", async () => {
    await models.action_audit.create({
      action: AUDIT_ACTION.LOGGED_IN,
      auditType: AUDIT_TYPE.AUTHENTICATION,
      user: "user"
    });

    const accessAudit = await models.legacy_data_change_audit.findAll();
    expect(accessAudit.length).toEqual(0);
  });

  test(" does not create audit on audit creation", async () => {
    await models.audit.create({
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: "user"
    });

    const audit = await models.legacy_data_change_audit.findAll();
    expect(audit.length).toEqual(0);
  });
});
