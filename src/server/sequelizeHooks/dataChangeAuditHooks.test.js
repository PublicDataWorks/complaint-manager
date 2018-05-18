import models from "../models/index";
import Case from "../../client/testUtilities/case";
import { DATA_CREATED, DATA_UPDATED } from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks", () => {
  afterEach(async () => {
    await models.cases.truncate({ cascade: true, force: true });
    await models.data_change_audit.truncate({ cascade: true, force: true });
  });

  describe("update case", () => {
    let createdCase = null;
    beforeEach(async () => {
      const initialCaseAttributes = new Case.Builder()
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
      createdCase = await models.cases.create(initialCaseAttributes);
    });

    test("it creates an audit entry for the case creation with the basic attributes", async () => {
      const audits = await createdCase.getDataChangeAudits();
      expect(audits.length).toEqual(1);
      const audit = audits[0];

      expect(audit.modelName).toEqual("case");
      expect(audit.modelId).toEqual(createdCase.id);
      expect(audit.action).toEqual(DATA_CREATED);
    });

    test("it saves the changes of the new values", async () => {
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedChanges = {
        narrativeSummary: { new: "original narrative summary" },
        narrativeDetails: { new: null },
        incidentTime: { new: null },
        incidentDate: { new: null },
        firstContactDate: { new: "2017-12-25" },
        district: { new: null },
        complainantType: { new: "Police Officer" },
        incidentLocationId: { new: null },
        assignedTo: { new: "originalAssignedToPerson" },
        status: { new: "Initial" }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the full snapshot of the object", async () => {
      const audit = (await createdCase.getDataChangeAudits())[0];

      const expectedSnapshot = {
        narrativeSummary: "original narrative summary",
        narrativeDetails: null,
        incidentTime: null,
        incidentDate: null,
        firstContactDate: "2017-12-25",
        district: null,
        complainantType: "Police Officer",
        incidentLocationId: null,
        assignedTo: "originalAssignedToPerson",
        status: "Initial",
        createdAt: createdCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: createdCase.updatedAt.toJSON(),
        id: createdCase.id
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });
  });

  describe("update case", () => {
    let existingCase = null;
    beforeEach(async () => {
      const initialCaseAttributes = new Case.Builder()
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
      existingCase = await models.cases.create(initialCaseAttributes);
    });

    test("it creates an audit entry for the case update with the basic attributes", async () => {
      await existingCase.update({
        narrativeSummary: "updated narrative summary"
      });

      const updateAudits = await existingCase.getDataChangeAudits({
        where: { action: DATA_UPDATED }
      });
      expect(updateAudits.length).toEqual(1);
      const auditUpdate = updateAudits[0];

      expect(auditUpdate.modelName).toEqual("case");
      expect(auditUpdate.modelId).toEqual(existingCase.id);
      expect(auditUpdate.action).toEqual(DATA_UPDATED);
    });

    test("it saves the changes when only one field has changed and status triggered", async () => {
      await existingCase.update({
        narrativeSummary: "updated narrative summary"
      });
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        narrativeSummary: {
          previous: "original narrative summary",
          new: "updated narrative summary"
        },
        status: { previous: "Initial", new: "Active" }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it saves the changes when many fields changed", async () => {
      await existingCase.update({
        complainantType: "Civilian",
        district: "2nd District",
        firstContactDate: "2018-01-01T00:00:00.000Z",
        incidentDate: "2017-12-05",
        incidentTime: "12:59:59",
        narrativeSummary: "updated narrative summary",
        narrativeDetails: "updated narrative details",
        assignedTo: "updatedAssignedPerson"
      });
      const audit = (await existingCase.getDataChangeAudits({
        where: { action: DATA_UPDATED }
      }))[0];

      const expectedChanges = {
        status: { previous: "Initial", new: "Active" },
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
      await existingCase.update({
        complainantType: "Civilian",
        district: "2nd District",
        firstContactDate: "2018-01-01T00:00:00.000Z",
        incidentDate: "2017-12-05",
        incidentTime: "12:59:59",
        narrativeSummary: "updated narrative summary",
        narrativeDetails: "updated narrative details",
        assignedTo: "updatedAssignedPerson"
      });
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
        incidentLocationId: null,
        assignedTo: "updatedAssignedPerson",
        status: "Active",
        createdAt: existingCase.createdAt.toJSON(),
        createdBy: "createdByPerson",
        updatedAt: existingCase.updatedAt.toJSON(),
        id: existingCase.id
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });
  });
});
