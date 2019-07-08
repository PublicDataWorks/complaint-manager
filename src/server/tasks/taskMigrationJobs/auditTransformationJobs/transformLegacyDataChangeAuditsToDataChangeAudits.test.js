import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import {
  revertDataChangeAuditsToLegacyDataChangeAudits,
  transformLegacyDataChangeAuditsToDataChangeAudits
} from "./transformLegacyDataChangeAuditsToDataChangeAudits";
import models from "../../../models";

describe("transform data change audits", () => {
  let existingCase;
  const testUser = "Billy Bones";

  beforeEach(async () => {
    existingCase = await createTestCaseWithoutCivilian();
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("revertDataChangeAuditsToLegacyDataChangeAudits", () => {
    test("should transform data change audit", async () => {
      const legacyDataChangeAudit = await models.legacy_data_change_audit.create(
        {
          caseId: existingCase.id,
          modelName: "Civilian",
          modelDescription: null,
          modelId: existingCase.id,
          snapshot: {},
          action: AUDIT_ACTION.DATA_UPDATED,
          changes: {
            firstName: {
              new: "Paco",
              previous: "Squid"
            }
          },
          user: testUser,
          createdAt: new Date("2019-02-25 17:03:51.26+00")
        }
      );

      const dataChangeAudit = await models.audit.create(
        {
          auditAction: legacyDataChangeAudit.action,
          user: legacyDataChangeAudit.user,
          caseId: legacyDataChangeAudit.caseId,
          createdAt: legacyDataChangeAudit.createdAt,
          dataChangeAudit: {
            modelName: "civilian",
            modelDescription: legacyDataChangeAudit.modelDescription,
            modelId: legacyDataChangeAudit.modelId,
            snapshot: legacyDataChangeAudit.snapshot,
            changes: legacyDataChangeAudit.changes
          }
        },
        {
          include: [{ model: models.data_change_audit, as: "dataChangeAudit" }]
        }
      );

      await models.sequelize.transaction(async transaction => {
        await revertDataChangeAuditsToLegacyDataChangeAudits(transaction);
      });

      const audits = await models.audit.findAll({
        where: {
          auditAction: {
            [models.sequelize.Op.or]: [
              AUDIT_ACTION.DATA_CREATED,
              AUDIT_ACTION.DATA_UPDATED,
              AUDIT_ACTION.DATA_ARCHIVED,
              AUDIT_ACTION.DATA_RESTORED,
              AUDIT_ACTION.DATA_DELETED
            ]
          }
        }
      });

      expect(audits.length).toEqual(0);

      const dataChangeAudits = await models.data_change_audit.findAll({});

      expect(dataChangeAudits.length).toEqual(0);
    });
  });

  describe("transformLegacyDataChangeAuditsToDataChangeAudits", () => {
    test("should transform legacy data change audit", async () => {
      const legacyDataChangeAudit = await models.legacy_data_change_audit.create(
        {
          caseId: existingCase.id,
          modelName: "Case",
          modelDescription: null,
          modelId: existingCase.id,
          snapshot: {},
          action: AUDIT_ACTION.DATA_CREATED,
          changes: {
            complaintType: {
              new: "Civilian Initiated"
            }
          },
          user: testUser,
          createdAt: new Date("2019-02-25 17:03:51.26+00")
        }
      );

      await models.sequelize.transaction(async transaction => {
        await transformLegacyDataChangeAuditsToDataChangeAudits(transaction);
      });

      const dataChangeAudit = await models.audit.findOne({
        include: [
          {
            model: models.data_change_audit,
            as: "dataChangeAudit"
          }
        ],
        where: { user: testUser }
      });

      expect(dataChangeAudit.toJSON()).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.DATA_CREATED,
          user: testUser,
          createdAt: legacyDataChangeAudit.createdAt,
          caseId: existingCase.id,
          dataChangeAudit: expect.objectContaining({
            modelName: "cases",
            modelDescription: null,
            modelId: existingCase.id,
            snapshot: {},
            changes: {
              complaintType: {
                new: "Civilian Initiated"
              }
            }
          })
        })
      );
    });

    test("should not transform legacy data change audit when identical data change audit already exists", async () => {
      const legacyDataChangeAudit = await models.legacy_data_change_audit.create(
        {
          caseId: existingCase.id,
          modelName: "Civilian",
          modelDescription: null,
          modelId: existingCase.id,
          snapshot: {},
          action: AUDIT_ACTION.DATA_UPDATED,
          changes: {
            firstName: {
              new: "Paco",
              previous: "Squid"
            }
          },
          user: testUser,
          createdAt: new Date("2019-02-25 17:03:51.26+00")
        }
      );

      const dataChangeAudit = await models.audit.create(
        {
          auditAction: legacyDataChangeAudit.action,
          user: legacyDataChangeAudit.user,
          caseId: legacyDataChangeAudit.caseId,
          createdAt: legacyDataChangeAudit.createdAt,
          dataChangeAudit: {
            modelName: "civilian",
            modelDescription: legacyDataChangeAudit.modelDescription,
            modelId: legacyDataChangeAudit.modelId,
            snapshot: legacyDataChangeAudit.snapshot,
            changes: legacyDataChangeAudit.changes
          }
        },
        {
          include: [{ model: models.data_change_audit, as: "dataChangeAudit" }]
        }
      );

      await models.sequelize.transaction(async transaction => {
        await transformLegacyDataChangeAuditsToDataChangeAudits(transaction);
      });

      const existingDataChangeAudits = await models.audit.findAll({
        where: { user: testUser },
        include: [{ model: models.data_change_audit, as: "dataChangeAudit" }]
      });

      expect(existingDataChangeAudits).toEqual([
        expect.objectContaining({
          updatedAt: dataChangeAudit.updatedAt
        })
      ]);
    });
  });
});
