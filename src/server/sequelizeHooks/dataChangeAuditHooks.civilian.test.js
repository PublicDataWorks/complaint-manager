import models from "../policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import Civilian from "../../sharedTestHelpers/civilian";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import RaceEthnicity from "../../sharedTestHelpers/raceEthnicity";

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
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "civilian"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Civilian Name": civilian.fullName }
    ]);
    expect(audit.managerType).toEqual("complaint");
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
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "civilian"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(civilian.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.changes.raceEthnicityId.new).toEqual(
      raceEthnicity.id
    );
  });

  test("it saves the changes when gender identity association has changed", async () => {
    const genderIdentity = await models.gender_identity.create({
      name: "Nonbinary"
    });

    await civilian.update(
      {
        genderIdentityId: genderIdentity.id
      },
      { auditUser: "someoneWhoUpdated" }
    );

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "civilian"
          }
        }
      ]
    });

    const expectedChanges = {
      genderIdentityId: {
        previous: null,
        new: genderIdentity.id
      },
      genderIdentity: {
        previous: null,
        new: genderIdentity.name
      }
    };
    expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
  });

  test("it saves the changes when civilian title association has changed", async () => {
    const civilianTitle = await models.civilian_title.create({
      name: "Professor"
    });

    await civilian.update(
      {
        civilianTitleId: civilianTitle.id
      },
      {
        auditUser: "anUpdatingPerson"
      }
    );

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "civilian"
          }
        }
      ]
    });

    const expectedChanges = {
      civilianTitleId: {
        previous: null,
        new: civilianTitle.id
      },
      civilianTitle: {
        previous: null,
        new: civilianTitle.name
      }
    };

    expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
  });
});
