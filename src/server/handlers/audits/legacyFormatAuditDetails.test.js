import models from "../../policeDataManager/models";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { legacyFormatAuditDetails } from "./legacyFormatAuditDetails";

describe("legacyFormatAuditDetails", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should replace attributes if all fields are present", async () => {
    const auditDetails = {
      cases: {
        attributes: Object.keys(models.cases.rawAttributes)
      },
      complainantCivilians: {
        attributes: Object.keys(models.civilian.rawAttributes),
        model: "civilian"
      }
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      Case: ["All Case Data"],
      "Complainant Civilians": ["All Complainant Civilians Data"]
    });
  });

  test("should replace attributes with All Complainant Civilian Data", async () => {
    const auditDetails = {
      complainantCivilians: {
        attributes: Object.keys(models.civilian.rawAttributes),
        model: models.civilian.name
      }
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      "Complainant Civilians": ["All Complainant Civilians Data"]
    });
  });

  test("should include edit status in audit details in addition to all case data", async () => {
    const auditDetails = {
      cases: {
        attributes: [...Object.keys(models.cases.rawAttributes), "Edit Status"]
      }
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      Case: ["All Case Data", "Edit Status"]
    });
  });

  test("formats audit details fields for subjects without models", async () => {
    const auditDetails = {
      cases: {
        attributes: ["id", "status"]
      },
      earliestAddedAccusedOfficer: {
        attributes: ["firstName", "middleName", "lastName", "personType"]
      },
      earliestAddedComplainant: {
        attributes: [
          "firstName",
          "middleName",
          "lastName",
          "suffix",
          "personType"
        ]
      }
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      Case: ["Id", "Status"],
      "Earliest Added Accused Officer": [
        "First Name",
        "Middle Name",
        "Last Name",
        "Person Type"
      ],
      "Earliest Added Complainant": [
        "First Name",
        "Middle Name",
        "Last Name",
        "Suffix",
        "Person Type"
      ]
    });
  });

  test("should reformat auditDetails when attributes exist", async () => {
    const auditDetails = {
      cases: {
        attributes: ["id", "status", "incidentDate"],
        model: models.cases.name
      },
      complainantCivilians: {
        attributes: ["firstName", "lastName"],
        model: "civilian"
      }
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      Case: ["Id", "Incident Date", "Status"],
      "Complainant Civilians": ["First Name", "Last Name"]
    });
  });

  test("it should populate auditDetails correctly", async () => {
    const auditDetails = {
      fileName: ["cats.jpg"],
      otherField: ["hello"]
    };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual(auditDetails);
  });

  test("it should populate details correctly for downloaded action with audit details given", async () => {
    const auditDetails = { fileName: ["cats.jpg"] };

    const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

    expect(formattedAuditDetails).toEqual({
      fileName: ["cats.jpg"]
    });
  });
});
