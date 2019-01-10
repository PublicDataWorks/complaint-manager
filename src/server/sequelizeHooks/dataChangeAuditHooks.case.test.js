import models from "../models/index";
import Case from "../../client/testUtilities/case";
import Classification from "../../client/testUtilities/classification";
import {
  AUDIT_ACTION,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import IntakeSource from "../../client/testUtilities/intakeSource";

describe("dataChangeAuditHooks", () => {
  afterEach(async () => {
    await cleanupDatabase();
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
    let utdClassification;
    let emailIntakeSource;

    beforeEach(async () => {
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplaintType(RANK_INITIATED)
        .withDistrict(null)
        .withFirstContactDate("2017-12-24")
        .withIncidentDate(null)
        .withIncidentTime(null)
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails(null)
        .withAssignedTo("originalAssignedToPerson")
        .withCreatedBy("createdByPerson");
      const utdClassificationAttributes = new Classification.Builder()
        .defaultClassification()
        .withInitialism("UTD")
        .withName("Unable to Determine");
      utdClassification = await models.classification.create(
        utdClassificationAttributes
      );
      const emailIntakeSourceAttributes = new IntakeSource.Builder()
        .defaultIntakeSource()
        .withName("Email");
      emailIntakeSource = await models.intake_source.create(
        emailIntakeSourceAttributes
      );
    });

    test("it creates an audit entry for the case creation with the basic attributes", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audits = await createdCase.getDataChangeAudits();
      expect(audits.length).toEqual(1);
      const audit = audits[0];

      expect(audit.modelName).toEqual("Case");
      expect(audit.modelId).toEqual(createdCase.id);
      expect(audit.action).toEqual(AUDIT_ACTION.DATA_CREATED);
      expect(audit.user).toEqual("someone");
    });

    test("it saves the changes of the new values", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        complaintType: { new: RANK_INITIATED },
        assignedTo: { new: "originalAssignedToPerson" },
        status: { new: CASE_STATUS.INITIAL },
        classificationId: { new: null },
        classification: { new: null }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes of the new values of intake source", async () => {
      Object.assign(initialCaseAttributes, {
        intakeSourceId: emailIntakeSource.id
      });
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        complaintType: { new: RANK_INITIATED },
        assignedTo: { new: "originalAssignedToPerson" },
        status: { new: CASE_STATUS.INITIAL },
        classificationId: { new: null },
        classification: { new: null },
        intakeSourceId: { new: emailIntakeSource.id },
        intakeSource: { new: emailIntakeSource.name }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });
    test("it saves the changes of the new values including the initialism of the classification", async () => {
      Object.assign(initialCaseAttributes, {
        classificationId: utdClassification.id
      });
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-24" },
        district: { new: null },
        complaintType: { new: RANK_INITIATED },
        assignedTo: { new: "originalAssignedToPerson" },
        status: { new: CASE_STATUS.INITIAL },
        classificationId: { new: utdClassification.id },
        classification: { new: utdClassification.initialism }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the full snapshot of the object", async () => {
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedSnapshot = {
        narrativeSummary: "original narrative summary",
        narrativeDetails: null,
        incidentTime: null,
        incidentDate: null,
        firstContactDate: "2017-12-24",
        district: null,
        complaintType: RANK_INITIATED,
        assignedTo: "originalAssignedToPerson",
        status: CASE_STATUS.INITIAL,
        createdAt: createdCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: createdCase.updatedAt.toJSON(),
        id: createdCase.id,
        classificationId: null,
        classification: null,
        intakeSourceId: null,
        intake_source: null,
        deletedAt: null
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });

    test("it captures the initialism of the classification in addition to the id in the snapshot", async () => {
      initialCaseAttributes.classificationId = utdClassification.id;
      const createdCase = await models.cases.create(initialCaseAttributes, {
        auditUser: "someone"
      });
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedSnapshot = {
        narrativeSummary: "original narrative summary",
        narrativeDetails: null,
        incidentTime: null,
        incidentDate: null,
        firstContactDate: "2017-12-24",
        district: null,
        complaintType: RANK_INITIATED,
        assignedTo: "originalAssignedToPerson",
        status: CASE_STATUS.INITIAL,
        createdAt: createdCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: createdCase.updatedAt.toJSON(),
        id: createdCase.id,
        classificationId: utdClassification.id,
        classification: utdClassification.initialism,
        intakeSourceId: null,
        intake_source: null,
        deletedAt: null
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });

    describe("errors on create", () => {
      let oldConsoleError = null;
      beforeAll(() => {
        oldConsoleError = console.error;
        console.error = jest.fn();
      });

      afterAll(() => {
        console.error = oldConsoleError;
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
          const audit = await models.data_change_audit.find({
            where: { modelName: "Case", action: AUDIT_ACTION.DATA_UPDATED }
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
          const audit = await models.data_change_audit.find({
            where: { modelName: "Case", action: AUDIT_ACTION.DATA_UPDATED }
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
    let utdClassification = null;
    let bwcClassification = null;
    let emailIntakeSource = null;

    beforeEach(async () => {
      const utdClassificationAttributes = new Classification.Builder()
        .defaultClassification()
        .withId(null)
        .withInitialism("UTD")
        .withName("Unable to Determine");
      utdClassification = await models.classification.create(
        utdClassificationAttributes
      );
      const emailIntakeSourceAttributes = new IntakeSource.Builder()
        .defaultIntakeSource()
        .withName("Email");
      emailIntakeSource = await models.intake_source.create(
        emailIntakeSourceAttributes
      );
      const bwcClassificationAttributes = new Classification.Builder()
        .defaultClassification()
        .withId(null)
        .withInitialism("BWC")
        .withName("Body Worn Camera");
      bwcClassification = await models.classification.create(
        bwcClassificationAttributes
      );
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplaintType(RANK_INITIATED)
        .withDistrict("1st District")
        .withFirstContactDate("2017-12-24")
        .withIncidentDate("2017-12-01")
        .withIncidentTime("01:01:01")
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails("original narrative details")
        .withAssignedTo("originalAssignedToPerson")
        .withClassificationId(utdClassification.id)
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

      const updateAudits = await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      });
      expect(updateAudits.length).toEqual(1);
      const auditUpdate = updateAudits[0];

      expect(auditUpdate.modelName).toEqual("Case");
      expect(auditUpdate.modelId).toEqual(existingCase.id);
      expect(auditUpdate.action).toEqual(AUDIT_ACTION.DATA_UPDATED);
      expect(auditUpdate.user).toEqual("someoneWhoUpdated");
      expect(auditUpdate.modelDescription).toEqual([]);
    });

    test("it saves the changes when only one field has changed and status triggered", async () => {
      await existingCase.update(
        {
          narrativeSummary: "updated narrative summary"
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        narrativeSummary: {
          previous: "original narrative summary",
          new: "updated narrative summary"
        },
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes when classification association has changed on instance update", async () => {
      await existingCase.update(
        {
          classificationId: bwcClassification.id
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        classificationId: {
          previous: utdClassification.id,
          new: bwcClassification.id
        },
        classification: {
          previous: utdClassification.initialism,
          new: bwcClassification.initialism
        },
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes when classification association has changed on class update", async () => {
      await models.cases.update(
        {
          classificationId: bwcClassification.id
        },
        {
          where: { id: existingCase.id },
          auditUser: "someoneWhoUpdated"
        }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        classificationId: {
          previous: utdClassification.id,
          new: bwcClassification.id
        },
        classification: {
          previous: utdClassification.initialism,
          new: bwcClassification.initialism
        },
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes when many fields changed", async () => {
      await existingCase.update(
        {
          complaintType: CIVILIAN_INITIATED,
          district: "2nd District",
          firstContactDate: "2018-01-01",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE },
        complaintType: { previous: RANK_INITIATED, new: CIVILIAN_INITIATED },
        district: { previous: "1st District", new: "2nd District" },
        firstContactDate: { previous: "2017-12-24", new: "2018-01-01" },
        incidentDate: { previous: "2017-12-01", new: "2017-12-05" },
        incidentTime: { previous: "01:01:01", new: "12:59:59" },
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
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves a snapshot of the objects new values", async () => {
      await existingCase.update(
        {
          complaintType: CIVILIAN_INITIATED,
          district: "2nd District",
          firstContactDate: "2018-01-01",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: AUDIT_ACTION.DATA_UPDATED }
      }))[0];

      const expectedSnapshot = {
        narrativeSummary: "updated narrative summary",
        narrativeDetails: "updated narrative details",
        incidentTime: "12:59:59",
        incidentDate: "2017-12-05",
        firstContactDate: "2018-01-01",
        district: "2nd District",
        complaintType: CIVILIAN_INITIATED,
        assignedTo: "updatedAssignedPerson",
        status: CASE_STATUS.ACTIVE,
        createdAt: existingCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: existingCase.updatedAt.toJSON(),
        id: existingCase.id,
        classificationId: existingCase.classificationId,
        classification: utdClassification.initialism,
        intakeSourceId: existingCase.intakeSourceId,
        intake_source: emailIntakeSource.name,
        deletedAt: null
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });

    test("does not record audit when nothing changes", async () => {
      await existingCase.update({}, { auditUser: "someone" });

      await models.data_change_audit.count().then(num => {
        expect(num).toEqual(1);
      });
    });

    describe("delete/destroy", () => {
      let existingCase = null;
      let initialCaseAttributes = {};
      let utdClassification = null;
      let bwcClassification = null;
      let intakeSource;

      beforeEach(async () => {
        const utdClassificationAttributes = new Classification.Builder()
          .defaultClassification()
          .withId(null)
          .withInitialism("UTD")
          .withName("Unable to Determine");
        utdClassification = await models.classification.create(
          utdClassificationAttributes
        );
        const bwcClassificationAttributes = new Classification.Builder()
          .defaultClassification()
          .withId(null)
          .withInitialism("BWC")
          .withName("Body Worn Camera");
        bwcClassification = await models.classification.create(
          bwcClassificationAttributes
        );

        const intakeSourceAttributes = new IntakeSource.Builder()
          .defaultIntakeSource()
          .withId(undefined);
        intakeSource = await models.intake_source.create(
          intakeSourceAttributes,
          { auditUser: "test" }
        );
        initialCaseAttributes = new Case.Builder()
          .defaultCase()
          .withId(undefined)
          .withIncidentLocation(undefined)
          .withClassificationId(utdClassification.id)
          .withIntakeSourceId(intakeSource.id);
        existingCase = await models.cases.create(initialCaseAttributes, {
          auditUser: "someone"
        });
      });

      test("should audit destroy including changes including classification association value", async () => {
        await existingCase.destroy({ auditUser: "someone" });
        const audit = await models.data_change_audit.find({
          where: {
            modelName: "Case",
            action: AUDIT_ACTION.DATA_ARCHIVED
          }
        });

        const expectedChanges = {
          assignedTo: { previous: "tuser" },
          classification: { previous: utdClassification.initialism },
          classificationId: { previous: utdClassification.id },
          complaintType: { previous: "Civilian Initiated" },
          district: { previous: "First District" },
          firstContactDate: { previous: "2017-12-24" },
          id: { previous: existingCase.id },
          incidentDate: { previous: "2017-01-01" },
          incidentTime: { previous: "16:00:00" },
          narrativeDetails: { previous: "test details" },
          narrativeSummary: { previous: "test summary" },
          status: { previous: "Initial" },
          intakeSourceId: { previous: intakeSource.id },
          intakeSource: { previous: intakeSource.name },
          intake_source: {}
        };
        expect(audit.changes).toEqual(expectedChanges);
      });
    });

    describe("errors on update", () => {
      let oldConsoleError = null;
      beforeAll(async () => {
        oldConsoleError = console.error;
        console.error = jest.fn();
      });

      afterAll(() => {
        console.error = oldConsoleError;
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

        const refreshedCase = await models.cases.findById(existingCase.id);
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

        const refreshedCase = await models.cases.findById(existingCase.id);
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

        const refreshedCase = await models.cases.findById(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });

      test("it does not create the audit if the case update fails", async () => {
        await models.data_change_audit.truncate({ cascade: true });
        try {
          await existingCase.update(
            { createdBy: null },
            { auditUser: "someone" }
          );
        } catch (error) {
          expect(error.name).toEqual("SequelizeValidationError");
        }
        await models.data_change_audit.count().then(numAudits => {
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
        const refreshedCase = await models.cases.findById(existingCase.id);
        expect(refreshedCase.narrativeDetails).toEqual(
          initialCaseAttributes.narrativeDetails
        );
      });
    });
  });
});
