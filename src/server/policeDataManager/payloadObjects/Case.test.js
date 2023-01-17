import Case from "./Case";
import CaseHelper from "../../../sharedTestHelpers/case";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import models from "../models";

describe("Case", () => {
  let statuses;

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("getCase", () => {
    test("should return undefined if case with given id does not exist", async () => {
      expect(await Case.getCase(1)).toBeUndefined();
    });

    test("should return the case if it exists", async () => {
      const c4se = await models.cases.create(
        new CaseHelper.Builder().defaultCase().withId(1).build(),
        { auditUser: "user" }
      );
      const wrapper = await Case.getCase(1);
      expect(wrapper.model.status.name).toEqual("Initial");
      expect(wrapper.id).toEqual(c4se.id);
      expect(wrapper.primaryComplainant).toEqual(c4se.primaryComplainant);
      expect(wrapper.complaintType).toEqual(c4se.complaintType);
      expect(wrapper.year).toEqual(c4se.year);
      expect(wrapper.caseNumber).toEqual(c4se.caseNumber);
      expect(wrapper.caseReferencePrefix).toEqual(c4se.caseReferencePrefix);
      expect(wrapper.firstContactDate).toEqual(c4se.firstContactDate);
      expect(wrapper.incidentDate).toEqual(c4se.incidentDate);
      expect(wrapper.intakeSourceId).toEqual(c4se.intakeSourceId);
      expect(wrapper.districtId).toEqual(c4se.districtId);
      expect(wrapper.incidentTime).toEqual(c4se.incidentTime);
      expect(wrapper.incidentTimezone).toEqual(c4se.incidentTimezone);
      expect(wrapper.narrativeSummary).toEqual(c4se.narrativeSummary);
      expect(wrapper.narrativeDetails).toEqual(c4se.narrativeDetails);
      expect(wrapper.pibCaseNumber).toEqual(c4se.pibCaseNumber);
      expect(wrapper.createdBy).toEqual(c4se.createdBy);
      expect(wrapper.assignedTo).toEqual(c4se.assignedTo);
      expect(wrapper.complainantOfficers).toEqual(c4se.complainantOfficers);
      expect(wrapper.complainantCivilians).toEqual(c4se.complainantCivilians);
      expect(wrapper.witnessOfficers).toEqual(c4se.witnessOfficers);
      expect(wrapper.witnessCivilians).toEqual(c4se.witnessCivilians);
      expect(wrapper.accusedOfficers).toEqual(c4se.accusedOfficers);
      expect(wrapper.incidentLocation).toEqual(c4se.incidentLocation);
      expect(wrapper.caseClassifications).toEqual(c4se.caseClassifications);
      expect(wrapper.howDidYouHearAboutUsSource).toEqual(
        c4se.howDidYouHearAboutUsSource
      );
      expect(wrapper.caseDistrict).toEqual(c4se.caseDistrict);
      expect(wrapper.intakeSource).toEqual(c4se.intakeSource);
      expect(wrapper.referralLetter).toEqual(c4se.referralLetter);
      expect(wrapper.caseTags).toEqual(c4se.caseTags);
      expect(wrapper.isArchived).toEqual(c4se.isArchived);
      expect(wrapper.pdfAvailable).toEqual(c4se.pdfAvailable);
    });
  });

  describe("constructor", () => {
    test("should save _status if status.name exists on model", () => {
      const fakeModel = { status: { name: "THE STATUS" } };
      const c4se = new Case(fakeModel);
      expect(c4se.model).toEqual(fakeModel);
      expect(c4se._status).toEqual("THE STATUS");
    });
  });

  describe("status", () => {
    let fakeModel, c4se;

    beforeEach(() => {
      fakeModel = { statusId: statuses[2].id };
      c4se = new Case(fakeModel);
    });

    test("should return status if already stored", async () => {
      const fakeModel = { status: { name: "THE STATUS" } };
      const c4se = new Case(fakeModel);
      expect(await c4se.getStatus()).toEqual("THE STATUS");
    });

    test("should retrieve status if not stored", async () => {
      expect(await c4se.getStatus()).toEqual(statuses[2].name);
    });

    test("should update _status if given status is the nextStatus", async () => {
      await c4se.setStatus(statuses[3].name);
      expect(c4se._status).toEqual(statuses[3].name);
    });

    test("should error if given status does not equal status or nextStatus", async () => {
      await expect(
        async () => await c4se.setStatus(statuses[0].name)
      ).rejects.toThrow(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });

    test("should leave status as is if given status equals status", async () => {
      await c4se.setStatus(statuses[2].name);
      expect(c4se._status).toEqual(statuses[2].name);
    });

    test("should give nextStatus", async () => {
      expect(await c4se.getNextStatus()).toEqual({
        id: statuses[3].id,
        name: statuses[3].name,
        order_key: statuses[3].orderKey
      });
    });
  });

  describe("toJSON", () => {
    test("should map toJSON", async () => {
      const model = await models.cases.create(
        new CaseHelper.Builder().defaultCase().build(),
        { auditUser: "user" }
      );
      const c4se = new Case(model);
      expect(await c4se.toJSON()).toEqual(
        expect.objectContaining({
          status: statuses[0].name,
          nextStatus: statuses[1].name,
          id: model.id,
          complaintType: model.complaintType
        })
      );
    });

    test("should return undefined nextStatus when status is Closed", async () => {
      const model = await models.cases.create(
        new CaseHelper.Builder()
          .defaultCase()
          .withStatusId(statuses.find(status => status.name === "Closed").id)
          .build(),
        { auditUser: "user" }
      );
      const c4se = new Case(model);
      const json = await c4se.toJSON();
      expect(json.status).toEqual("Closed");
      expect(json.nextStatus).toBeUndefined();
    });
  });
});
