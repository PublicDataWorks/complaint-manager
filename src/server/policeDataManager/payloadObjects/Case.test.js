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
    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("constructor", () => {
    test("should save _status if currentStatus.name exists on model", () => {
      const fakeModel = { currentStatus: { name: "THE STATUS" } };
      const c4se = new Case(fakeModel);
      expect(c4se.model).toEqual(fakeModel);
      expect(c4se._status).toEqual("THE STATUS");
    });
  });

  describe("status", () => {
    let fakeModel, c4se;

    beforeEach(() => {
      fakeModel = { currentStatusId: statuses[2].id };
      c4se = new Case(fakeModel);
    });

    test("should return status if already stored", async () => {
      const fakeModel = { currentStatus: { name: "THE STATUS" } };
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

    test("should error if given status does not equal currentStatus or nextStatus", async () => {
      await expect(
        async () => await c4se.setStatus(statuses[0].name)
      ).rejects.toThrow(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });

    test("should leave status as is if given status equals currentStatus", async () => {
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
    test("", async () => {
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
  });
});
