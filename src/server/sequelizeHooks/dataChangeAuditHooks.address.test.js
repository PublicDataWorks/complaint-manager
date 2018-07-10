import models from "../models";
import {
  DATA_CREATED,
  DATA_DELETED,
  DATA_UPDATED
} from "../../sharedUtilities/constants";
import Case from "../../client/testUtilities/case";
import Address from "../../client/testUtilities/Address";
import Civilian from "../../client/testUtilities/civilian";

describe("dataChangeAuditHooks address", () => {
  afterEach(async () => {
    await models.address.truncate({ force: true, auditUser: "someone" });
    await models.civilian.truncate({ force: true, auditUser: "someone" });
    await models.cases.truncate({
      cascade: true,
      force: true,
      auditUser: "someone"
    });
    await models.data_change_audit.truncate();
  });

  describe("incident location", () => {
    let existingCase, incidentLocationCreated;
    beforeEach(async () => {
      const anIncidentLocation = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType("cases")
        .withAddressableId(undefined)
        .build();

      const caseToCreate = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(anIncidentLocation)
        .build();

      existingCase = await models.cases.create(caseToCreate, {
        include: [
          {
            model: models.address,
            as: "incidentLocation",
            auditUser: "someone"
          }
        ],
        auditUser: "someone"
      });

      incidentLocationCreated = existingCase.incidentLocation;
    });

    test("should audit incident location", async () => {
      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_CREATED }
      });

      expect(audit.caseId).toEqual(existingCase.id);
      expect(audit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Incident Location"
        }
      ]);
    });

    test("should audit incident location update", async () => {
      await models.address.update(
        { city: "newLocation" },
        { where: { id: incidentLocationCreated.id }, auditUser: "someone" }
      );

      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_UPDATED }
      });

      expect(audit.caseId).toEqual(existingCase.id);
      expect(audit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Incident Location"
        }
      ]);
    });

    test("should audit incident location on delete", async () => {
      await models.address.destroy({
        where: { id: incidentLocationCreated.id },
        auditUser: "someone"
      });

      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_DELETED }
      });

      expect(audit.caseId).toEqual(existingCase.id);
      expect(audit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Incident Location"
        }
      ]);
    });
  });

  describe("civilian address created with nested include", () => {
    let createdCase, createdCivilian, createdAddress;

    beforeEach(async () => {
      const address = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableId(undefined)
        .withAddressableType("civilian")
        .build();
      const civilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withAddress(address)
        .withRoleOnCase("Complainant")
        .build();
      const caseDetails = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([civilian])
        .withId(undefined)
        .build();

      createdCase = await models.cases.create(caseDetails, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "someone",
            include: [{ model: models.address, auditUser: "someone" }]
          }
        ],
        auditUser: "someone"
      });

      createdCivilian = createdCase.complainantCivilians[0];
      createdAddress = createdCivilian.address;
    });

    test("should audit civilian address", async () => {
      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_CREATED }
      });

      expect(audit.caseId).toEqual(createdCase.id);
      expect(audit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Civilian"
        },
        {
          "Civilian Name": createdCivilian.fullName
        }
      ]);
    });

    test("should audit civilian address on update", async () => {
      await models.address.update(
        { city: "new city" },
        { where: { id: createdAddress.id }, auditUser: "someone" }
      );

      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_UPDATED }
      });

      expect(audit.caseId).toEqual(createdCase.id);
      expect(audit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Civilian"
        },
        {
          "Civilian Name": createdCivilian.fullName
        }
      ]);
    });

    test("should audit civilian address on delete", async () => {
      await models.address.destroy({
        where: { id: createdAddress.id },
        auditUser: "someone"
      });

      const audit = await models.data_change_audit.find({
        where: { modelName: "Address", action: DATA_DELETED }
      });

      expect(audit.caseId).toEqual(createdCase.id);
      expect(audit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.modelDescription).toEqual([
        {
          "Address Type": "Civilian"
        },
        {
          "Civilian Name": createdCivilian.fullName
        }
      ]);
    });
  });
});
