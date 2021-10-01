import models from "../policeDataManager/models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../sharedUtilities/constants";

describe("data access audit", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("does not create audit on audit creation", async () => {
    await models.audit.create({
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: "user",
      managerType: "complaint"
    });

    const audit = await models.data_change_audit.findAll();
    expect(audit.length).toEqual(0);
  });
});
