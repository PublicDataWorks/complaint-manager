import models from "../models/index";
import Case from "../../client/testUtilities/case";
import {
  CASE_STATUS,
  DATA_CREATED,
  DATA_UPDATED
} from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks", () => {
  afterEach(async () => {
    await models.cases.truncate({
      cascade: true,
      force: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate({ cascade: true, force: true });
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
    beforeEach(async () => {
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplainantType("Police Officer")
        .withDistrict(null)
        .withFirstContactDate("2017-12-25T00:00:00.000Z")
        .withIncidentDate(null)
        .withIncidentTime(null)
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails(null)
        .withAssignedTo("originalAssignedToPerson")
        .withCreatedBy("createdByPerson");
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
      expect(audit.action).toEqual(DATA_CREATED);
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
        firstContactDate: { new: "2017-12-25" },
        district: { new: null },
        complainantType: { new: "Police Officer" },
        assignedTo: { new: "originalAssignedToPerson" },
        status: { new: CASE_STATUS.INITIAL }
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
        firstContactDate: "2017-12-25",
        district: null,
        complainantType: "Police Officer",
        assignedTo: "originalAssignedToPerson",
        status: CASE_STATUS.INITIAL,
        createdAt: createdCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: createdCase.updatedAt.toJSON(),
        id: createdCase.id
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
            { firstContactDate: new Date() },
            { auditUser: "test user" }
          );
          const audit = await models.data_change_audit.find({
            where: { modelName: "Case", action: DATA_UPDATED }
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
            { firstContactDate: new Date() },
            { auditUser: "test user" }
          );
          const audit = await models.data_change_audit.find({
            where: { modelName: "Case", action: DATA_UPDATED }
          });
          expect(audit).toEqual(null);
        } catch (error) {
          expect(error.message).toEqual(
            "Model must implement getCaseId (Case)"
          );
        }
      });

      test("it does not create the case if the audit fails", async () => {
        await models.cases.truncate({ cascade: true, auditUser: "test user" });
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
        await models.data_change_audit.truncate({ cascade: true });
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
    beforeEach(async () => {
      initialCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplainantType("Police Officer")
        .withDistrict("1st District")
        .withFirstContactDate("2017-12-25T00:00:00.000Z")
        .withIncidentDate("2017-12-01")
        .withIncidentTime("01:01:01")
        .withNarrativeSummary("original narrative summary")
        .withNarrativeDetails("original narrative details")
        .withAssignedTo("originalAssignedToPerson")
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
        where: { action: DATA_UPDATED }
      });
      expect(updateAudits.length).toEqual(1);
      const auditUpdate = updateAudits[0];

      expect(auditUpdate.modelName).toEqual("Case");
      expect(auditUpdate.modelId).toEqual(existingCase.id);
      expect(auditUpdate.action).toEqual(DATA_UPDATED);
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
        where: { action: DATA_UPDATED }
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

    test("it saves the changes when many fields changed", async () => {
      await existingCase.update(
        {
          complainantType: "Civilian",
          district: "2nd District",
          firstContactDate: "2018-01-01T00:00:00.000Z",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE },
        complainantType: { previous: "Police Officer", new: "Civilian" },
        district: { previous: "1st District", new: "2nd District" },
        firstContactDate: { previous: "2017-12-25", new: "2018-01-01" },
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
          complainantType: "Civilian",
          district: "2nd District",
          firstContactDate: "2018-01-01T00:00:00.000Z",
          incidentDate: "2017-12-05",
          incidentTime: "12:59:59",
          narrativeSummary: "updated narrative summary",
          narrativeDetails: "updated narrative details",
          assignedTo: "updatedAssignedPerson"
        },
        { auditUser: "someoneWhoUpdated" }
      );
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: DATA_UPDATED }
      }))[0];

      const expectedSnapshot = {
        narrativeSummary: "updated narrative summary",
        narrativeDetails: "updated narrative details",
        incidentTime: "12:59:59",
        incidentDate: "2017-12-05",
        firstContactDate: "2018-01-01",
        district: "2nd District",
        complainantType: "Civilian",
        assignedTo: "updatedAssignedPerson",
        status: CASE_STATUS.ACTIVE,
        createdAt: existingCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: existingCase.updatedAt.toJSON(),
        id: existingCase.id
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
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
