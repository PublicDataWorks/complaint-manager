import {
  DATA_CREATED,
  DATA_DELETED,
  DATA_UPDATED
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
      action: DATA_CREATED,
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
      action: DATA_UPDATED,
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
      action: DATA_UPDATED,
      changes: {
        id: { new: 5 },
        caseId: { new: 6, previous: 5 },
        addressableType: { new: "Case", previous: "Civilian" }
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

  test("transforms changes field to empty string for destroyed model", () => {
    const audit = {
      action: DATA_DELETED,
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
        id: 392,
        createdAt: "2018-01-01 12:12:00"
      },
      subject: "Case",
      modelDescription: "a model description"
    };

    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot:
            "a model description\nName: Bob Smith\nAge: 50\nCase DB ID: 392\nCreated At: 2018-01-01 12:12:00"
        })
      ])
    );
  });

  test("transforms snapshot field when there is no model description", () => {
    const audit = {
      snapshot: {
        name: "Bob Smith",
        age: 50,
        id: 392,
        createdAt: "2018-01-01 12:12:00"
      },
      subject: "Case",
      modelDescription: ""
    };

    const transformedAudit = transformDataChangeAuditForExport([audit]);

    expect(transformedAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot:
            "Name: Bob Smith\nAge: 50\nCase DB ID: 392\nCreated At: 2018-01-01 12:12:00"
        })
      ])
    );
  });

  test("excludes objects, arrays, nulls, and relational fields (*Id and AddressableType) from snapshot", () => {
    const audit = {
      snapshot: {
        id: 392,
        addressableId: 5,
        addressableType: "Civilian",
        civilian: { name: "John" },
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
          snapshot: "Case DB ID: 392\nIs Something: true"
        })
      ])
    );
  });
});
