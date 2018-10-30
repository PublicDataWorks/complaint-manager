import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION
} from "../../../sharedUtilities/constants";

const AUDIT_TYPE = require("../../../sharedUtilities/constants").AUDIT_TYPE;

const transformDataChangeAuditForExport = require("./transformDataChangeAuditForExport");

describe("transformDataChangeAuditForExport", () => {
  test("should transform audit type for export", () => {
    const audit = [{}];

    const transformedAudit = transformDataChangeAuditForExport(audit);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ audit_type: AUDIT_TYPE.DATA_CHANGE })
      ])
    );
  });

  test("transforms changes field to empty when created for created model", () => {
    const audit = {
      action: AUDIT_ACTION.DATA_CREATED,
      changes: {
        details: { new: "New Details" },
        otherDetails: { new: "New new" }
      }
    };
    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changes: ""
        })
      ])
    );
  });

  test("transforms changes field for updated model", () => {
    const audit = {
      action: AUDIT_ACTION.DATA_UPDATED,
      changes: {
        details: { new: "New Details", previous: "Old Details" },
        otherDetails: { new: "New new", previous: "old Old" },
        name: { new: "John", previous: null }
      }
    };
    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changes:
            "Details changed from 'Old Details' to 'New Details'\nOther Details changed from 'old Old' to 'New new'\nName changed from '' to 'John'"
        })
      ])
    );
  });

  test("transforms changes field to ignore id, *Id, and addressableType", () => {
    const audit = {
      action: AUDIT_ACTION.DATA_UPDATED,
      changes: {
        id: { new: 5 },
        caseId: { new: 6, previous: 5 },
        addressableType: {
          new: ADDRESSABLE_TYPE.CASES,
          previous: ADDRESSABLE_TYPE.CIVILIAN
        }
      }
    };
    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changes: ""
        })
      ])
    );
  });

  test("transforms changes field to ignore lat, lng, and placeId", () => {
    const audit = {
      action: AUDIT_ACTION.DATA_UPDATED,
      changes: {
        lat: { new: 234.543 },
        lng: { new: 890.0, previous: 123.4 },
        placeId: { new: "newPlaceId", previous: "oldPlaceId" },
        latch: { new: "new", previous: "prev" },
        slngs: { new: "new2", previous: "prev2" }
      }
    };
    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changes:
            "Latch changed from 'prev' to 'new'\nSlngs changed from 'prev2' to 'new2'"
        })
      ])
    );
  });

  test("transforms changes field to empty string for destroyed model", () => {
    const audit = {
      action: AUDIT_ACTION.DATA_DELETED,
      changes: {
        details: { previous: "Old Details" },
        otherDetails: { previous: "old Old" }
      }
    };
    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changes: ""
        })
      ])
    );
  });

  test("transforms snapshot field when there is a model description", () => {
    const audit = {
      snapshot: {
        name: "Bob Smith",
        age: 50,
        id: 392
      },
      subject: "Case",
      modelDescription: [{ tis: "a" }, { model: "description" }]
    };

    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot:
            "Tis: a\nModel: description\n\n\nName: Bob Smith\nAge: 50\nCase Id: 392"
        })
      ])
    );
  });

  test("transforms snapshot field when there is no model description", () => {
    const audit = {
      snapshot: {
        name: "Bob Smith",
        age: 50,
        id: 392
      },
      subject: "Case",
      modelDescription: ""
    };

    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot: "Name: Bob Smith\nAge: 50\nCase Id: 392"
        })
      ])
    );
  });

  test("excludes objects, arrays, nulls, createdAt, updatedAt, deletedAt and AddressableType from snapshot", () => {
    const audit = {
      snapshot: {
        id: 392,
        addressableId: 5,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN,
        civilian: { name: "John" },
        createdAt: "2018-01-01 12:12:00",
        updatedAt: "2018-01-01 12:12:00",
        deletedAt: "2018-01-01 12:14:00",
        allegations: ["one", "two"],
        nullField: null,
        isSomething: true
      },
      subject: "Case"
    };

    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot: "Case Id: 392\nAddressable Id: 5\nIs Something: true"
        })
      ])
    );
  });
});
