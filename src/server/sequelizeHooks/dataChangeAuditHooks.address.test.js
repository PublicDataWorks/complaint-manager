import models from "../policeDataManager/models";
import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION
} from "../../sharedUtilities/constants";
import Case from "../../sharedTestHelpers/case";
import Address from "../../sharedTestHelpers/Address";
import Civilian from "../../sharedTestHelpers/civilian";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("dataChangeAuditHooks address", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("incident location", () => {
    let existingCase, incidentLocationCreated;
    beforeEach(async () => {
      const anIncidentLocation = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType(ADDRESSABLE_TYPE.CASES)
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
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(existingCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
        {
          "Address Type": "Incident Location"
        }
      ]);
      expect(audit.managerType).toEqual("complaint");
    });

    test("should audit incident location update", async () => {
      await models.address.update(
        { city: "newLocation" },
        { where: { id: incidentLocationCreated.id }, auditUser: "someone" }
      );

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(existingCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
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

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(existingCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(incidentLocationCreated.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
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
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
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
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(createdCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
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

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(createdCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
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

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "address"
            }
          }
        ]
      });

      expect(audit.referenceId).toEqual(createdCase.id);
      expect(audit.dataChangeAudit.modelId).toEqual(createdAddress.id);
      expect(audit.user).toEqual("someone");
      expect(audit.dataChangeAudit.modelDescription).toEqual([
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
