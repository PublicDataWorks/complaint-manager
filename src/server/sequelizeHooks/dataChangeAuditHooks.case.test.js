import models from "../policeDataManager/models/index";
import Case from "../../sharedTestHelpers/case";
import CaseStatus from "../../sharedTestHelpers/caseStatus";
import {
  AUDIT_ACTION,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import IntakeSource from "../testHelpers/intakeSource";
import HowDidYouHearAboutUsSource from "../testHelpers/HowDidYouHearAboutUsSource";
import winston from "winston";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("dataChangeAuditHooks", () => {
  jest.setTimeout(60000);
  let complaintType, civilianInitiated;
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    complaintType = await models.complaintTypes.create({
      name: RANK_INITIATED
    });

    civilianInitiated = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("audit not implemented", () => {
    test("calling upsert throws an error", () => {
      expect(models.cases.upsert({})).rejects.toEqual(
        new Error("Audit is not implemented for this function.")
      );
    });
  });

  describe("create case", () => {
    let initialCaseAttributes = {};
    let emailIntakeSource;
    let friendHowDidYouHearAboutUsSource;

    beforeEach(async () => {
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplaintTypeId(complaintType.id)
        .withDistrict(null)
        .withDistrictId(null)
        .withFirstContactDate("2017-12-24")
        .withIncidentDate(null)
        .withIncidentTime(null)
        .withIncidentTimezone(null)
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails(null)
        .withYear("2017")
        .withPrimaryComplainant({
          officerId: "1234",
          caseEmployeeType: "Officer"
        })
        .withAssignedTo("originalAssignedToPerson")
        .withCreatedBy("createdByPerson");

      const emailIntakeSourceAttributes = new IntakeSource.Builder()
        .defaultIntakeSource()
        .withName("Email");
      emailIntakeSource = await models.intake_source.create(
        emailIntakeSourceAttributes
      );
      const friendHowDidYouHearAboutUsSourceAttributes =
        new HowDidYouHearAboutUsSource.Builder()
          .defaultHowDidYouHearAboutUsSource()
          .withName("Friend");
      friendHowDidYouHearAboutUsSource =
        await models.how_did_you_hear_about_us_source.create(
          friendHowDidYouHearAboutUsSourceAttributes
        );
    });

    test("it creates an audit entry for the case creation with the basic attributes", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });

      expect(audit.dataChangeAudit.modelName).toEqual("cases");
      expect(audit.dataChangeAudit.modelId).toEqual(createdCase.id);
      expect(audit.auditAction).toEqual(AUDIT_ACTION.DATA_CREATED);
      expect(audit.user).toEqual("someone");
      expect(audit.managerType).toEqual("complaint");
    });

    test("it saves the changes of the new values", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });
      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentTimezone: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        districtId: { new: null },
        complaintTypeId: { new: complaintType.id },
        assignedTo: { new: "originalAssignedToPerson" },
        statusId: { new: 1 },
        caseNumber: { new: 1 },
        primaryComplainant: {},
        year: { new: 2017 }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes of the new values of intake source", async () => {
      Object.assign(initialCaseAttributes, {
        intakeSourceId: emailIntakeSource.id
      });
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });
      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentTimezone: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        districtId: { new: null },
        complaintTypeId: { new: complaintType.id },
        assignedTo: { new: "originalAssignedToPerson" },
        statusId: { new: 1 },
        intakeSourceId: { new: emailIntakeSource.id },
        intakeSource: { new: emailIntakeSource.name },
        caseNumber: { new: 1 },
        primaryComplainant: {},
        year: { new: 2017 }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes of the new values of how did you hear about us source", async () => {
      Object.assign(initialCaseAttributes, {
        howDidYouHearAboutUsSourceId: friendHowDidYouHearAboutUsSource.id
      });
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });

      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentTimezone: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        districtId: { new: null },
        complaintTypeId: { new: complaintType.id },
        assignedTo: { new: "originalAssignedToPerson" },
        statusId: { new: 1 },
        howDidYouHearAboutUsSourceId: {
          new: friendHowDidYouHearAboutUsSource.id
        },
        howDidYouHearAboutUsSource: {
          new: friendHowDidYouHearAboutUsSource.name
        },
        caseNumber: { new: 1 },
        primaryComplainant: {},
        year: { new: 2017 }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it saves the full snapshot of the object", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });
      const expectedSnapshot = {
        narrativeSummary: "original narrative summary",
        narrativeDetails: null,
        incidentTime: null,
        incidentTimezone: null,
        incidentDate: null,
        firstContactDate: "2017-12-24",
        howDidYouHearAboutUsSourceId: null,
        howDidYouHearAboutUsSource: null,
        district: null,
        districtId: null,
        complaintTypeId: complaintType.id,
        assignedTo: "originalAssignedToPerson",
        statusId: 1,
        createdAt: createdCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: createdCase.updatedAt.toJSON(),
        id: createdCase.id,
        intakeSourceId: null,
        intakeSource: null,
        isCase: true,
        deletedAt: null,
        caseNumber: 1,
        caseReferencePrefix: createdCase.caseReferencePrefix,
        caseReference: createdCase.caseReference,
        year: 2017,
        pibCaseNumber: null
      };
      expect(audit.dataChangeAudit.snapshot).toEqual(expectedSnapshot);
    });

    describe("errors on create", () => {
      let oldConsoleError = null;
      beforeAll(() => {
        oldConsoleError = winston.error;
        winston.error = jest.fn();
      });

      afterAll(() => {
        winston.error = oldConsoleError;
      });

      test("it does not allow blank username", () => {
        expect(
          models.cases.create(initialCaseAttributes, { auditUser: "" })
        ).rejects.toEqual(
          new Error(
            "User nickname must be given to db query for auditing. (Case Created)"
          )
        );
      });

      test("it does not allow for model with no model description method", async () => {
        let testInstance = await models.cases.create(initialCaseAttributes, {
          auditUser: "test user"
        });

        testInstance.modelDescription = undefined;
        try {
          await testInstance.update(
            { firstContactDate: "2018-01-01" },
            { auditUser: "test user" }
          );
          const audit = await models.audit.findOne({
            where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
            include: [
              {
                as: "dataChangeAudit",
                model: models.data_change_audit,
                where: {
                  modelName: "cases"
                }
              }
            ]
          });
          expect(audit).toEqual(null);
        } catch (error) {
          expect(error.message).toEqual(
            "Model must implement modelDescription (Case)"
          );
        }
      });

      test("it does not create audit if caseId is null", async () => {
        let testInstance = await models.cases.create(initialCaseAttributes, {
          auditUser: "test user"
        });

        testInstance.getCaseId = undefined;
        try {
          await testInstance.update(
            { firstContactDate: "2018-01-01" },
            { auditUser: "test user" }
          );
          const audit = await models.audit.findOne({
            where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
            include: [
              {
                as: "dataChangeAudit",
                model: models.data_change_audit,
                where: {
                  modelName: "cases"
                }
              }
            ]
          });
          expect(audit).toEqual(null);
        } catch (error) {
          expect(error.message).toEqual(
            "Model must implement getCaseId (Case)"
          );
        }
      });

      test("it does not create the case if the audit fails", async () => {
        try {
          await models.cases.create(initialCaseAttributes, { auditUser: null });
        } catch (error) {
          expect(error).toEqual(
            new Error(
              "User nickname must be given to db query for auditing. (Case Created)"
            )
          );
        }

        await models.cases.count().then(numCases => {
          expect(numCases).toEqual(0);
        });
      });

      test("it does not create the audit if the case creation fails", async () => {
        try {
          await models.cases.create({}, { auditUser: "someone" });
        } catch (error) {
          expect(error.name).toEqual("SequelizeValidationError");
        }
        await models.data_change_audit.count().then(numAudits => {
          expect(numAudits).toEqual(0);
        });
      });
    });
  });

  describe("update case", () => {
    let existingCase = null;
    let initialCaseAttributes = {};
    let emailIntakeSource = null;

    beforeEach(async () => {
      const emailIntakeSourceAttributes = new IntakeSource.Builder()
        .defaultIntakeSource()
        .withName("Email");
      emailIntakeSource = await models.intake_source.create(
        emailIntakeSourceAttributes
      );
      await models.district.create({
        id: 1,
        name: "1st District"
      });
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplaintTypeId(complaintType.id)
        .withDistrict("1st District")
        .withDistrictId(1)
        .withFirstContactDate("2017-12-24")
        .withIncidentDate("2017-12-01")
        .withIncidentTime("01:01:01")
        .withIncidentTimezone("CST")
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails("original narrative details")
        .withAssignedTo("originalAssignedToPerson")
        .withIntakeSourceId(emailIntakeSource.id)
        .withCreatedBy("createdByPerson");
      existingCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
    });

    test("it creates an audit entry for the case update with the basic attributes", async () => {
      await existingCase.update(
        {
          narrativeSummary: "updated narrative summary"
        },
        { auditUser: "someoneWhoUpdated" }
      );

      const auditUpdate = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });

      expect(auditUpdate.dataChangeAudit.modelName).toEqual("cases");
      expect(auditUpdate.dataChangeAudit.modelId).toEqual(existingCase.id);
      expect(auditUpdate.auditAction).toEqual(AUDIT_ACTION.DATA_UPDATED);
      expect(auditUpdate.user).toEqual("someoneWhoUpdated");
      expect(auditUpdate.dataChangeAudit.modelDescription).toEqual([
        { "Case Reference": existingCase.caseReference }
      ]);
    });

    test("it saves the changes when only one field has changed and status triggered", async () => {
      await existingCase.update(
        {
          narrativeSummary: "updated narrative summary"
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
              modelName: "cases"
            }
          }
        ]
      });

      const expectedChanges = {
        narrativeSummary: {
          previous: "original narrative summary",
          new: "updated narrative summary"
        }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes when many fields changed", async () => {
      await models.district.create({
        id: 2,
        name: "2nd District"
      });
      await existingCase.update(
        {
          complaintType: CIVILIAN_INITIATED,
          district: "2nd District",
          districtId: 2,
          firstContactDate: "2018-01-01",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          incidentTimezone: "EST",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
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
              modelName: "cases"
            }
          }
        ]
      });

      const expectedChanges = {
        district: { previous: "1st District", new: "2nd District" },
        districtId: { previous: 1, new: 2 },
        firstContactDate: { previous: "2017-12-24", new: "2018-01-01" },
        incidentDate: { previous: "2017-12-01", new: "2017-12-05" },
        incidentTime: { previous: "01:01:01", new: "12:59:59" },
        incidentTimezone: { previous: "CST", new: "EST" },
        narrativeSummary: {
          previous: "original narrative summary",
          new: "updated narrative summary"
        },
        narrativeDetails: {
          previous: "original narrative details",
          new: "updated narrative details"
        },
        assignedTo: {
          previous: "originalAssignedToPerson",
          new: "updatedAssignedPerson"
        }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it saves a snapshot of the objects new values", async () => {
      await models.district.create({
        id: 2,
        name: "2nd District"
      });
      await existingCase.update(
        {
          complaintTypeId: civilianInitiated.id,
          district: "2nd District",
          districtId: 2,
          firstContactDate: "2018-01-01",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          incidentTimezone: "CST",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
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
              modelName: "cases"
            }
          }
        ]
      });

      const expectedSnapshot = {
        narrativeSummary: "updated narrative summary",
        narrativeDetails: "updated narrative details",
        incidentTime: "12:59:59",
        incidentTimezone: "CST",
        incidentDate: "2017-12-05",
        firstContactDate: "2018-01-01",
        howDidYouHearAboutUsSourceId: null,
        howDidYouHearAboutUsSource: null,
        district: "2nd District",
        districtId: 2,
        complaintTypeId: civilianInitiated.id,
        assignedTo: "updatedAssignedPerson",
        statusId: 1,
        createdAt: existingCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: existingCase.updatedAt.toJSON(),
        id: existingCase.id,
        intakeSourceId: existingCase.intakeSourceId,
        intakeSource: emailIntakeSource.name,
        deletedAt: null,
        caseNumber: 1,
        caseReferencePrefix: existingCase.caseReferencePrefix,
        caseReference: existingCase.caseReference,
        year: 2017,
        pibCaseNumber: null
      };
      expect(audit.dataChangeAudit.snapshot).toEqual(
        expect.objectContaining(expectedSnapshot)
      );
    });

    test("does not record audit when nothing changes", async () => {
      await existingCase.update({}, { auditUser: "someone" });

      await models.data_change_audit.count().then(num => {
        expect(num).toEqual(1);
      });
    });

    describe("errors on update", () => {
      let oldConsoleError = null;
      beforeAll(async () => {
        oldConsoleError = winston.error;
        winston.error = jest.fn();
      });

      afterAll(() => {
        winston.error = oldConsoleError;
      });

      test("it does not allow blank username", () => {
        expect(
          existingCase.update(
            { narrativeDetails: "something new happened" },
            { auditUser: "" }
          )
        ).rejects.toEqual(
          new Error(
            "User nickname must be given to db query for auditing. (Case Updated)"
          )
        );
      });

      test("it does not update the case if the audit fails when updating an instance", async () => {
        try {
          await existingCase.update(
            { narrativeDetails: "something new happened" },
            { auditUser: null }
          );
        } catch (error) {
          expect(error).toEqual(
            new Error(
              "User nickname must be given to db query for auditing. (Case Updated)"
            )
          );
        }

        const refreshedCase = await models.cases.findByPk(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });

      test("it does not update the case if the audit fails when updating Model class with individual hooks", async () => {
        try {
          await models.cases.update(
            { narrativeDetails: "something new happened" },
            {
              where: { id: existingCase.id },
              auditUser: null,
              individualHooks: true
            }
          );
        } catch (error) {
          expect(error).toEqual(
            new Error(
              "User nickname must be given to db query for auditing. (Case Updated)"
            )
          );
        }

        const refreshedCase = await models.cases.findByPk(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });

      test("it does not update the case if the audit fails when updating Model class without individual hooks", async () => {
        try {
          await models.cases.update(
            { narrativeDetails: "something new happened" },
            { where: { id: existingCase.id }, auditUser: null }
          );
        } catch (error) {
          expect(error).toEqual(
            new Error(
              "User nickname must be given to db query for auditing. (Case Updated)"
            )
          );
        }

        const refreshedCase = await models.cases.findByPk(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });

      test("it does not create the audit if the case update fails", async () => {
        await models.audit.truncate({
          cascade: true,
          include: [
            {
              as: "dataChangeAudit",
              model: models.data_change_audit,
              where: {
                modelName: "cases"
              }
            }
          ]
        });

        try {
          await existingCase.update(
            { createdBy: null },
            { auditUser: "someone" }
          );
        } catch (error) {
          expect(error.name).toEqual("SequelizeValidationError");
        }
        await models.audit
          .count({
            include: [
              {
                as: "dataChangeAudit",
                model: models.data_change_audit,
                where: {
                  modelName: "cases"
                }
              }
            ]
          })
          .then(numAudits => {
            expect(numAudits).toEqual(0);
          });
      });

      test("it rolls back outer transaction if audit fails", async () => {
        try {
          await models.sequelize.transaction(async t => {
            await models.cases.create(initialCaseAttributes, {
              auditUser: "sldkfj",
              transaction: t
            });
            return await existingCase.update(
              { narrativeDetails: "something new happened" },
              { auditUser: null, transaction: t }
            );
          });
        } catch (error) {
          expect(error).toEqual(
            new Error(
              "User nickname must be given to db query for auditing. (Case Updated)"
            )
          );
        }

        await models.cases.count().then(numCases => {
          expect(numCases).toEqual(1);
        });
        const refreshedCase = await models.cases.findByPk(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });
    });
  });

  describe("delete/destroy", () => {
    let existingCase = null;
    let initialCaseAttributes = {};
    let intakeSource;

    beforeEach(async () => {
      const intakeSourceAttributes = new IntakeSource.Builder()
        .defaultIntakeSource()
        .withId(undefined);
      intakeSource = await models.intake_source.create(intakeSourceAttributes, {
        auditUser: "test"
      });
      await models.district.create({
        id: 1,
        name: "1st District"
      });
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withIntakeSourceId(intakeSource.id);
      existingCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
    });

    test("should audit restore", async () => {
      await existingCase.destroy({ auditUser: "someone" });
      await existingCase.restore({ auditUser: "someone" });

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_RESTORED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });

      const expectedChanges = {
        assignedTo: { new: "tuser" },
        complaintTypeId: { new: null },
        district: { new: null },
        districtId: { new: null },
        firstContactDate: { new: "2017-12-24" },
        howDidYouHearAboutUsSourceId: { new: null },
        howDidYouHearAboutUsSource: { new: null },
        year: { new: 2017 },
        caseNumber: { new: 1 },
        id: { new: existingCase.id },
        incidentDate: { new: "2017-01-01" },
        incidentTime: { new: "16:00:00" },
        incidentTimezone: { new: "CST" },
        isCase: { new: true },
        narrativeDetails: { new: "<p> test details </p>" },
        narrativeSummary: { new: "test summary" },
        statusId: { new: 1 },
        intakeSourceId: { new: intakeSource.id },
        intakeSource: { new: intakeSource.name },
        pibCaseNumber: {
          new: null
        }
      };

      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("should audit destroy ", async () => {
      await existingCase.destroy({ auditUser: "someone" });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_ARCHIVED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "cases"
            }
          }
        ]
      });

      const expectedChanges = {
        assignedTo: { previous: "tuser" },
        complaintTypeId: { previous: null },
        district: { previous: null },
        districtId: { previous: null },
        firstContactDate: { previous: "2017-12-24" },
        howDidYouHearAboutUsSourceId: { previous: null },
        howDidYouHearAboutUsSource: { previous: null },
        year: { previous: 2017 },
        caseNumber: { previous: 1 },
        id: { previous: existingCase.id },
        incidentDate: { previous: "2017-01-01" },
        incidentTime: { previous: "16:00:00" },
        incidentTimezone: { previous: "CST" },
        isCase: { previous: true },
        narrativeDetails: { previous: "<p> test details </p>" },
        narrativeSummary: { previous: "test summary" },
        statusId: { previous: 1 },
        intakeSourceId: { previous: intakeSource.id },
        intakeSource: { previous: intakeSource.name },
        pibCaseNumber: {
          previous: null
        }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });
  });
});
