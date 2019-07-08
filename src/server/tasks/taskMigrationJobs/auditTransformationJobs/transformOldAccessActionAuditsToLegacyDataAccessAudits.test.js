import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  TIMEZONE
} from "../../../../sharedUtilities/constants";
import moment from "moment-timezone";
import {
  transformLegacyDataAccessAuditsToOldAccessActionAudits,
  transformOldAccessActionAuditsToLegacyDataAccessAudits
} from "./transformOldAccessActionAuditsToLegacyDataAccessAudits";

describe("test transformLegacyAccessActionAuditsToLegacyDataAccessAudits", () => {
  const testUser = "Winnie the Pooh";
  const testSubject = "Hundred Acre Wood";

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("transformOldAccessActionAuditsToLegacyDataAccessAudits", () => {
    test("should transform only legacy access action audits to legacy data access audit before cutoff time", async () => {
      const legacyCreatedAtTime = moment.tz("2019-02-24 05:12:12", TIMEZONE);
      const secondLegacyCreatedAtTime = moment.tz(
        "2019-02-24 05:15:12",
        TIMEZONE
      );
      const postLegacyCreatedAtTime = moment.tz(
        "2019-06-26 05:12:15",
        TIMEZONE
      );
      const legacyAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: [
          "Case Information",
          "Civilian Complainants",
          "Officer Complainants",
          "Accused Officers"
        ],
        createdAt: legacyCreatedAtTime
      });

      const secondLegacyAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: ["Accused Officers"],
        createdAt: legacyCreatedAtTime
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: {
          Case: ["All Case Data"]
        },
        createdAt: postLegacyCreatedAtTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformOldAccessActionAuditsToLegacyDataAccessAudits(
          transaction
        );
      });

      const legacyAccessAudits = await models.audit.findAll({
        include: [
          {
            model: models.legacy_data_access_audit,
            as: "legacyDataAccessAudit"
          }
        ]
      });

      expect(legacyAccessAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: legacyAudit.createdAt,
            caseId: null,
            legacyDataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              auditDetails: legacyAudit.auditDetails
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: secondLegacyAudit.createdAt,
            caseId: null,
            legacyDataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              auditDetails: secondLegacyAudit.auditDetails
            })
          })
        ])
      );
    });
  });

  describe("transformLegacyDataAccessAuditsToOldAccessActionAudits", () => {
    test("should delete legacy data access audits", async () => {
      await models.audit.create(
        {
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          user: testUser,
          caseId: null,
          createdAt: moment.tz("2019-02-01 05:12:15", TIMEZONE),
          legacyDataAccessAudit: {
            auditSubject: testSubject,
            auditDetails: [
              "Case Information",
              "Civilian Complainants",
              "Officer Complainants"
            ]
          }
        },
        {
          include: [
            {
              model: models.legacy_data_access_audit,
              as: "legacyDataAccessAudit"
            }
          ]
        }
      );

      await models.audit.create(
        {
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          user: testUser,
          caseId: null,
          createdAt: moment.tz("2019-02-02 05:12:15", TIMEZONE),
          legacyDataAccessAudit: {
            auditSubject: testSubject,
            auditDetails: [
              "Case Information",
              "Civilian Complainants",
              "Officer Complainants"
            ]
          }
        },
        {
          include: [
            {
              model: models.legacy_data_access_audit,
              as: "legacyDataAccessAudit"
            }
          ]
        }
      );

      await models.sequelize.transaction(async transaction => {
        await transformLegacyDataAccessAuditsToOldAccessActionAudits();
      });

      const audits = await models.audit.findAll({});

      expect(audits.length).toEqual(0);

      const legacyDataAccessAudits = await models.legacy_data_access_audit.findAll(
        {}
      );

      expect(legacyDataAccessAudits.length).toEqual(0);
    });
  });
});
