import models from "../models";
import Case from "../../client/testUtilities/case";
import { DATA_CREATED, DATA_UPDATED } from "../../sharedUtilities/constants";
import Civilian from "../../client/testUtilities/civilian";

describe("dataChangeAuditHooks for civilian", () => {
  let existingCase, civilian;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withNoAddress();
    civilian = await models.civilian.create(civilianAttributes, {
      auditUser: "someone"
    });
  });
  afterEach(async () => {
    await models.cases.truncate({ cascade: true, auditUser: true });
    await models.data_change_audit.truncate();
  });

  test("creates audit on civilian creation", async () => {
    const audit = await models.data_change_audit.find({
      where: { modelName: "Civilian", action: DATA_CREATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
    expect(audit.modelDescription).toEqual(civilian.fullName);
  });

  test("should throw an exception if update is called with returning true", async () => {
    try {
      await models.civilian.update(
        { firstName: "updated" },
        {
          where: {
            id: civilian.id
          },
          returning: true,
          auditUser: "test user"
        }
      );
      expect(true).toEqual(false);
    } catch (e) {
      expect(e.message).toEqual('Invalid option: "returning:true"');
    }
  });

  test("creates audit on civilian update", async () => {
    await models.civilian.update(
      { firstName: "Updated Name" },
      { where: { id: civilian.id }, auditUser: "someone" }
    );
    const audit = await models.data_change_audit.find({
      where: { modelName: "Civilian", action: DATA_UPDATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
  });
});
