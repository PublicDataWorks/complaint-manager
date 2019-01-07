import models from "../models";
import Case from "../../client/testUtilities/case";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import Civilian from "../../client/testUtilities/civilian";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import RaceEthnicity from "../../client/testUtilities/raceEthnicity";

describe("dataChangeAuditHooks for civilian", () => {
  let existingCase, civilian, raceEthnicity, civilianAttributes;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const filipinoRaceEthnicityAttributes = new RaceEthnicity.Builder()
      .defaultRaceEthnicity()
      .withName("Filipino");
    raceEthnicity = await models.race_ethnicity.create(
      filipinoRaceEthnicityAttributes
    );
    civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRaceEthnicityId(raceEthnicity.id)
      .withNoAddress();

    civilian = await models.civilian.create(civilianAttributes, {
      auditUser: "someone"
    });
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("creates audit on civilian creation", async () => {
    const audit = await models.data_change_audit.find({
      where: { modelName: "Civilian", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
    expect(audit.modelDescription).toEqual([
      { "Civilian Name": civilian.fullName }
    ]);
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
    const samoanRaceEthnicityAttributes = new RaceEthnicity.Builder()
      .withId(20)
      .withName("Samoan");
    raceEthnicity = await models.race_ethnicity.create(
      samoanRaceEthnicityAttributes
    );
    await models.civilian.update(
      { firstName: "Updated Name", raceEthnicityId: raceEthnicity.id },
      { where: { id: civilian.id }, auditUser: "someone" }
    );
    const audit = await models.data_change_audit.find({
      where: { modelName: "Civilian", action: AUDIT_ACTION.DATA_UPDATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
    expect(audit.changes.raceEthnicityId.new).toEqual(raceEthnicity.id);
  });
});
